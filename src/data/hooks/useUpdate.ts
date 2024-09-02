import type { CreateMutationOptions, CreateMutationResult, MutateOptions } from '@tanstack/solid-query'
import { createMutation } from '@tanstack/solid-query'
import type {
    BaseKey,
    BaseRecord,
    GetListResponse,
    GetManyResponse,
    GetOneResponse,
    HttpError,
    IQueryKeys,
    MetaQuery,
    MutationMode,
    SuccessErrorNotification,
    PrevContext as UpdateContext,
    UpdateResponse,
} from '../types'
import { keys, pickDataProvider } from '../utils'
import { useDataProvider } from './useDataProvider.tsx'

export type OptimisticUpdateMapType<TData, TVariables> = {
    list?:
    | ((previous: GetListResponse<TData> | null | undefined, values: TVariables, id: BaseKey,) => GetListResponse<TData> | null)
    | boolean
    many?:
    | ((previous: GetManyResponse<TData> | null | undefined, values: TVariables, id: BaseKey,) => GetManyResponse<TData> | null)
    | boolean
    detail?:
    | ((previous: GetOneResponse<TData> | null | undefined, values: TVariables, id: BaseKey,) => GetOneResponse<TData> | null)
    | boolean
}

export type UpdateParams<TData, TError, TVariables> = {
    /**
     * Resource name for API data interactions
     */
    resource?: string
    /**
     * id for mutation function
     */
    id?: BaseKey
    /**
     * [Determines when mutations are executed](/advanced-tutorials/mutation-mode.md)
     */
    mutationMode?: MutationMode
    /**
     * Duration in ms to wait before executing the mutation when `mutationMode = "undoable"`
     */
    undoableTimeout?: number
    /**
     * Provides a function to cancel the mutation when `mutationMode = "undoable"`
     */
    onCancel?: (cancelMutation: () => void) => void
    /**
     * Values for mutation function
     */
    values?: TVariables
    /**
     * Metadata query for dataProvider
     */
    meta?: MetaQuery
    /**
     * If there is more than one `dataProvider`, you should use the `dataProviderName` that you will use.
     * @default "default"
     */
    dataProviderName?: string
    /**
     *  You can use it to manage the invalidations that will occur at the end of the mutation.
     */
    invalidates?: Array<keyof IQueryKeys>
    /**
     * You can use it to customize the optimistic update logic.
     * @default {
     *   list: true,
     *   many: true,
     *   detail: true,
     * }
     */
    optimisticUpdateMap?: OptimisticUpdateMapType<TData, TVariables>
} & SuccessErrorNotification<UpdateResponse<TData>, TError, { id: BaseKey, values: TVariables }>

export type UseUpdateReturnType<
    TData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TVariables = {},
> = CreateMutationResult<
    UpdateResponse<TData>,
    TError,
    UpdateParams<TData, TError, TVariables>,
    UpdateContext<TData>
>

export type UseUpdateProps<
    TData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TVariables = {},
> = {
    mutationOptions?: Omit<
        CreateMutationOptions<
            UpdateResponse<TData>,
            TError,
            UpdateParams<TData, TError, TVariables>,
            UpdateContext<TData>
        >,
    'mutationFn' | 'onMutate'
    >
} & UpdateParams<TData, TError, TVariables>

/**
 * `useUpdate` is a modified version of `react-query`'s {@link https://react-query.tanstack.com/reference/useMutation `useMutation`} for update mutations.
 *
 * It uses `update` method as mutation function from the `dataProvider` which is passed to `<Refine>`.
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/data/useUpdate} for more details.
 *
 * @typeParam TData - Result data of the query extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences/#httperror `HttpError`}
 * @typeParam TVariables - Values for mutation function
 *
 */
export function useUpdate<
    TData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TVariables = {},
>({
    id: idFromProps,
    resource: resourceFromProps,
    values: valuesFromProps,
    dataProviderName: dataProviderNameFromProps,
    meta: metaFromProps,
}: UseUpdateProps<TData, TError, TVariables> = {}): UseUpdateReturnType<
        TData,
        TError,
        TVariables
    > {
    const dataProvider = useDataProvider()
    const mutationResult = createMutation<
        UpdateResponse<TData>,
        TError,
        UpdateParams<TData, TError, TVariables>,
        UpdateContext<TData>
    >(() => ({
        mutationFn: ({
            id = idFromProps,
            values = valuesFromProps,
            resource: resourceName = resourceFromProps,
            meta = metaFromProps,
            dataProviderName = dataProviderNameFromProps,
        }) => {
            if (!id)
                throw missingIdError
            if (!values)
                throw missingValuesError
            if (!resourceName)
                throw missingResourceError

            return dataProvider(pickDataProvider(dataProviderName)).update<TData, TVariables>({
                resource: resourceName,
                id,
                variables: values,
                meta,
            })
        },
        mutationKey: keys().data().mutation('update').get(),
    }))
    const { mutate, mutateAsync, ...mutation } = mutationResult

    // this function is used to make the `variables` parameter optional
    const handleMutation = (
        variables?: UpdateParams<TData, TError, TVariables>,
        options?: MutateOptions<UpdateResponse<TData>, TError, UpdateParams<TData, TError, TVariables>, UpdateContext<TData>>,
    ) => {
        return mutate(variables || {}, options)
    }

    // this function is used to make the `variables` parameter optional
    const handleMutateAsync = (
        variables?: UpdateParams<TData, TError, TVariables>,
        options?: MutateOptions<UpdateResponse<TData>, TError, UpdateParams<TData, TError, TVariables>, UpdateContext<TData>>,
    ) => {
        return mutateAsync(variables || {}, options)
    }

    return {
        ...mutation,
        mutate: handleMutation,
        mutateAsync: handleMutateAsync,
    }
}

const missingResourceError = new Error(
    '[useUpdate]: `resource` is not defined or not matched but is required',
)

const missingIdError = new Error(
    '[useUpdate]: `id` is not defined but is required in edit and clone actions',
)

const missingValuesError = new Error(
    '[useUpdate]: `values` is not provided but is required',
)
