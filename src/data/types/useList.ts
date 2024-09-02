import type { GetListResponse } from './data'
import type { PartialCreateQueryOptions } from './query'
import type { CrudFilter, CrudSort, MetaQuery, Pagination } from '.'

export interface BaseListProps {
    /**
     * Pagination properties
     */
    pagination?: Pagination
    /**
     * Whether to use server-side pagination or not
     * @deprecated `hasPagination` property is deprecated. Use `pagination.mode` instead.
     */
    hasPagination?: boolean
    /**
     * Sorter parameters
     */
    sorters?: CrudSort[]
    /**
     * Filter parameters
     */
    filters?: () => CrudFilter[]
    /**
     * Meta data query for `dataProvider`
     */
    meta?: MetaQuery
    /**
     * If there is more than one `dataProvider`, you should use the `dataProviderName` that you will use
     */
    dataProviderName?: string
}

export type UseListProps<TQueryFnData, TError, TData> = {
    /**
     * Resource name for API data interactions
     */
    resource: string

    /**
     * Tanstack Query's [useQuery](https://tanstack.com/query/v4/docs/reference/useQuery) options
     */
    queryOptions?: PartialCreateQueryOptions<GetListResponse<TQueryFnData>, TError, GetListResponse<TData>>
} & BaseListProps
