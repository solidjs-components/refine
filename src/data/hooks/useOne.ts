import type { CreateQueryOptions, QueryObserverResult } from '@tanstack/solid-query'
import { createQuery } from '@tanstack/solid-query'
import { keys, pickDataProvider } from '../utils'

import type { BaseKey, BaseRecord, GetOneResponse, HttpError, MetaQuery, Prettify, SuccessErrorNotification } from '../types'
import { useDataProvider } from './useDataProvider'

export type UseOneProps<TQueryFnData, TError, TData> = {
    /**
     * Resource name for API data interactions
     */
    resource?: string
    /**
     * id of the item in the resource
     * @type [`BaseKey`](/docs/api-reference/core/interfaceReferences/#basekey)
     */
    id?: BaseKey
    /**
     * react-query's [useQuery](https://tanstack.com/query/v4/docs/reference/useQuery) options
     */
    queryOptions?: CreateQueryOptions<GetOneResponse<TQueryFnData>, TError, GetOneResponse<TData>>
    /**
     * Metadata query for `dataProvider`,
     */
    meta?: MetaQuery
    /**
     * If there is more than one `dataProvider`, you should use the `dataProviderName` that you will use.
     * @default `"default"``
     */
    dataProviderName?: string
} & SuccessErrorNotification<GetOneResponse<TData>, TError, Prettify<{ id?: BaseKey } & MetaQuery>>

/**
 * `useOne` is a modified version of `react-query`'s {@link https://react-query.tanstack.com/guides/queries `useQuery`} used for retrieving single items from a `resource`.
 *
 * It uses `getOne` method as query function from the `dataProvider` which is passed to `<Refine>`.
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/data/useOne} for more details.
 *
 * @typeParam TQueryFnData - Result data returned by the query function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#httperror `HttpError`}
 * @typeParam TData - Result data returned by the `select` function. Extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}. Defaults to `TQueryFnData`
 *
 */

export function useOne<
    TQueryFnData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TData extends BaseRecord = TQueryFnData,
>({
    resource,
    id,
    queryOptions = () => ({ queryKey: [] }),
    meta,
    dataProviderName,
}: UseOneProps<TQueryFnData, TError, TData>): QueryObserverResult<GetOneResponse<TData>, TError> {
    const dataProvider = useDataProvider()

    const pickedDataProvider = pickDataProvider(
        dataProviderName,
    )

    const { getOne } = dataProvider(pickedDataProvider)

    return createQuery<GetOneResponse<TQueryFnData>, TError, GetOneResponse<TData>>(() => ({
        queryKey: keys()
            .data(pickedDataProvider)
            .resource(String(id))
            .action('one')
            .id(id ?? '')
            .get(),
        queryFn: () =>
            getOne<TQueryFnData>({
                resource: resource ?? '',
                id: id!,
                meta,
            }),
        ...queryOptions,
        enabled:
          typeof queryOptions().enabled !== 'undefined'
              ? queryOptions().enabled
              : typeof id !== 'undefined',
        meta: {
            ...queryOptions().meta,
        },
    }))
}
