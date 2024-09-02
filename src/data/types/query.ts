import type { FunctionedParams, SolidInfiniteQueryOptions, SolidQueryOptions } from '@tanstack/solid-query'
import type { DefaultError, QueryKey } from '@tanstack/query-core'

export type PartialCreateQueryOptions<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
> = FunctionedParams<
    Omit<
        SolidQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        'queryFn' | 'queryKey' | 'initialData'
    >
>

export type PartialCreateInfiniteQueryOptions<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
    TPageParam = unknown,
> = FunctionedParams<Partial<SolidInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey, TPageParam>>>

export interface InfiniteData<TData> {
    pages: TData[]
    pageParams: unknown[]
}
