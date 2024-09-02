import { type QueryObserverResult, createQuery } from '@tanstack/solid-query'
import type { MaybeAccessor } from '@solidjs-components/utils'
import { access } from '@solidjs-components/utils'
import type {
    BaseRecord,
    CrudFilter,
    CrudSort,
    CustomResponse,
    HttpError,
    MetaQuery,
    PartialCreateQueryOptions,
} from '../types'
import { keys } from '../utils'
import { useDataProvider } from './useDataProvider'

interface UseCustomConfig<TQuery, TPayload> {
    /**
     * @deprecated `sort` is deprecated, use `sorters` instead.
     */
    sort?: CrudSort[]
    sorters?: CrudSort[]
    filters?: CrudFilter[]
    query?: TQuery
    payload?: TPayload
    headers?: {}
}

export interface UseCustomProps<TQueryFnData, TError, TQuery, TPayload, TData> {
    /**
     * request's URL
     */
    url: MaybeAccessor<string>
    /**
     * request's method (`GET`, `POST`, etc.)
     */
    method: 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch'
    /**
     * The config of your request. You can send headers, payload, query, filters and sorters using this field
     */
    config?: MaybeAccessor<UseCustomConfig<TQuery, TPayload>>
    /**
     * react-query's [useQuery](https://tanstack.com/query/v4/docs/reference/useQuery) options"
     */
    queryOptions?: PartialCreateQueryOptions<CustomResponse<TQueryFnData>, TError, CustomResponse<TData>>
    /**
     * meta data for `dataProvider`
     */
    meta?: MetaQuery

    /**
     * If there is more than one `dataProvider`, you should use the `dataProviderName` that you will use.
     */
    dataProviderName?: string
}

/**
 * `useCustom` is a modified version of `react-query`'s {@link https://react-query.tanstack.com/guides/queries `useQuery`} used for custom requests.
 *
 * It uses the `custom` method from the `dataProvider` which is passed to `<Refine>`.
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/data/useCustom} for more details.
 *
 * @typeParam TQueryFnData - Result data returned by the query function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#httperror `HttpError`}
 * @typeParam TQuery - Values for query params
 * @typeParam TPayload - Values for params
 * @typeParam TData - Result data returned by the `select` function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}. Defaults to `TQueryFnData`
 *
 */

export function useCustom<
    TQueryFnData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TQuery = unknown,
    TPayload = unknown,
    TData extends BaseRecord = TQueryFnData,
>({
    url,
    method,
    config,
    queryOptions = () => ({}),
    meta,
    dataProviderName,
}: UseCustomProps<TQueryFnData, TError, TQuery, TPayload, TData>): QueryObserverResult<CustomResponse<TData>, TError> {
    const dataProvider = useDataProvider()

    const { custom } = dataProvider(dataProviderName)

    if (custom) {
        return createQuery<CustomResponse<TQueryFnData>, TError, CustomResponse<TData>>(() => ({
            queryKey: keys()
                .data(dataProviderName)
                .mutation('custom')
                .params({
                    method,
                    url,
                    ...access(config),
                })
                .get(),
            queryFn: () =>
                custom<TQueryFnData>({
                    url: access(url),
                    method,
                    ...access(config),
                    meta: {
                        ...meta,
                    },
                }),
            ...queryOptions(),
            meta: {
                ...(queryOptions ? queryOptions()?.meta : {}),
            },
        }))
    }

    throw new Error('Not implemented custom on data provider.')
}
