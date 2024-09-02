import { createQuery } from '@tanstack/solid-query'
import type { BaseRecord, GetListResponse, HttpError, UseListProps } from '../types'
import { handlePaginationParams, keys, pickDataProvider } from '../utils'
import { useDataProvider } from './useDataProvider'

export function useList<
    TQueryFnData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TData extends BaseRecord = TQueryFnData,
>({
    dataProviderName,
    filters = () => ([]),
    pagination,
    meta,
    hasPagination,
    sorters,
    resource,
    queryOptions = () => ({}),
}: UseListProps<TQueryFnData, TError, TData>) {
    const dataProvider = useDataProvider()

    const { getList } = dataProvider(pickDataProvider(dataProviderName))

    const prefferedPagination = handlePaginationParams({
        pagination,
        hasPagination,
    })
    const isServerPagination = prefferedPagination.mode === 'server'
    return createQuery<GetListResponse<TQueryFnData>, TError, GetListResponse<TData>>(
        () => ({
            queryKey: keys()
                .data(dataProvider.name)
                .resource('')
                .action('list')
                .params({
                    ...(meta || {}),
                    filters: filters(),
                    hasPagination: isServerPagination,
                    ...(isServerPagination && {
                        pagination: prefferedPagination,
                    }),
                    ...(sorters && { sorters }),
                })
                .get(),
            queryFn: () => {
                return getList<TQueryFnData>({
                    resource: resource ?? '',
                    pagination: prefferedPagination,
                    filters: filters(),
                    sorters,
                })
            },
            ...queryOptions(),
        }),
    )
}
