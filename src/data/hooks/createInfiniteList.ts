import type { InfiniteData } from '@tanstack/solid-query'
import { createInfiniteQuery } from '@tanstack/solid-query'
import type { MaybeAccessor } from '@solidjs-components/utils'
import { access } from '@solidjs-components/utils'
import type {
    BaseRecord,
    CrudFilter,
    CrudSort,
    GetListResponse,
    HttpError,
    MetaQuery,
    Pagination,
    PartialCreateInfiniteQueryOptions,
} from '../types'
import { getNextPageParam, getPreviousPageParam, handlePaginationParams, keys, pickDataProvider } from '../utils'
import { useDataProvider } from './useDataProvider'

type BaseInfiniteListProps = {
    /**
     *  Metadata query for `dataProvider`
     */
    meta?: MetaQuery
    /**
     * Pagination properties
     */
    pagination?: Pagination
    /**
     * Sorter parameters
     */
    sorters?: CrudSort[]
    /**
     * Filter parameters
     */
    filters?: MaybeAccessor<CrudFilter[]>
    /**
     * If there is more than one `dataProvider`, you should use the `dataProviderName` that you will use
     */
    dataProviderName?: string
}

export type UseInfiniteListProps<TQueryFnData, TError, TData> = {
    /**
     * Resource name for API data interactions
     */
    resource: string
    /**
     * Tanstack Query's [useInfiniteQuery](https://tanstack.com/query/v4/docs/react/reference/useInfiniteQuery) options
     */
    queryOptions?: PartialCreateInfiniteQueryOptions<GetListResponse<TQueryFnData>, TError, GetListResponse<TData>>
} & BaseInfiniteListProps

/**
 * `useInfiniteList` is a modified version of `react-query`'s {@link https://tanstack.com/query/latest/docs/react/guides/infinite-queries `useInfiniteQuery`} used for retrieving items from a `resource` with pagination, sort, and filter configurations.
 *
 * It uses the `getList` method as the query function from the `dataProvider` which is passed to `<Refine>`.
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/data/useInfiniteList} for more details.
 *
 * @typeParam TQueryFnData - Result data returned by the query function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#httperror `HttpError`}
 * @typeParam TData - Result data returned by the `select` function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}. Defaults to `TQueryFnData`
 *
 */
export function createInfiniteList<
    TQueryFnData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TData extends BaseRecord = TQueryFnData,
>({
    resource: resourceFromProp,
    filters,
    pagination,
    sorters,
    queryOptions = () => ({}),
    meta,
    dataProviderName,
}: UseInfiniteListProps<TQueryFnData, TError, TData>) {
    const dataProvider = useDataProvider()

    const pickedDataProvider = pickDataProvider(dataProviderName)

    const prefferedPagination = handlePaginationParams({ pagination })
    const isServerPagination = pagination?.mode === 'server'

    const { getList } = dataProvider(pickedDataProvider)

    // @ts-ignore
    return createInfiniteQuery<GetListResponse<TQueryFnData>, TError, InfiniteData<GetListResponse<TQueryFnData>>>(() => ({
        queryKey: keys()
            .data(pickedDataProvider)
            .resource('')
            .action('infinite')
            .params({
                ...(meta || {}),
                filters,
                hasPagination: isServerPagination,
                ...(isServerPagination && {
                    pagination: prefferedPagination,
                }),
                ...(sorters && {
                    sorters,
                }),
            })
            .get(),
        queryFn: async (context) => {
            const paginationProperties = {
                ...prefferedPagination,
                current: context.pageParam as number,
            }

            const { data, total, ...rest } = await getList<TQueryFnData>({
                resource: resourceFromProp,
                pagination: paginationProperties,
                filters: access(filters),
                sorters,
                meta,
            })
            return {
                data,
                total,
                pagination: paginationProperties,
                ...rest,
            }
        },
        ...queryOptions(),
        getNextPageParam: lastPage => getNextPageParam(lastPage),
        getPreviousPageParam: lastPage => getPreviousPageParam(lastPage),
        meta: {
            ...queryOptions().meta,
        },
        initialPageParam: 1,
        initialData: { pages: [], pageParams: [] },
    }))
}
