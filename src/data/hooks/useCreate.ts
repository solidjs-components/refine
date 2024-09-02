import { type CreateMutationOptions, createMutation } from '@tanstack/solid-query'
import type {
    BaseRecord,
    CreateResponse,
    HttpError,
    IQueryKeys,
    MetaQuery,
    SuccessErrorNotification,
    UseMutationResult,
} from '../types'
import { keys, pickDataProvider } from '../utils'
import { useDataProvider } from './useDataProvider'

import { useHandleNotification } from './notifications/useHandleNotification'

export type UseCreateParams<TData, TError, TVariables> = {
    /**
     * Resource name for API data interactions
     */
    resource?: string
    /**
     * Values for mutation function
     */
    values?: TVariables
    /**
     * Meta data for `dataProvider`
     */
    meta?: MetaQuery
    /**
     * Meta data for `dataProvider`
     * @deprecated `metaData` is deprecated with refine@4, refine will pass `meta` instead, however, we still support `metaData` for backward compatibility.
     */
    metaData?: MetaQuery
    /**
     * If there is more than one `dataProvider`, you should use the `dataProviderName` that you will use.
     */
    dataProviderName?: string
    /**
     * You can use it to manage the invalidations that will occur at the end of the mutation.
     */
    invalidates?: Array<keyof IQueryKeys>
} & SuccessErrorNotification<CreateResponse<TData>, TError, TVariables>

export type UseCreateReturnType<
    TData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TVariables = {},
> = UseMutationResult<
    CreateResponse<TData>,
    TError,
    UseCreateParams<TData, TError, TVariables>,
    unknown
>

export type UseCreateProps<
    TData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TVariables = {},
> = {
    mutationOptions?: CreateMutationOptions<CreateResponse<TData>, TError, UseCreateParams<TData, TError, TVariables>, unknown>
} & UseCreateParams<TData, TError, TVariables>

/**
 * `useCreate` is a modified version of `react-query`'s {@link https://react-query.tanstack.com/reference/useMutation `useMutation`} for create mutations.
 *
 * It uses `create` method as mutation function from the `dataProvider` which is passed to `<Refine>`.
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/data/useCreate} for more details.
 *
 * @typeParam TData - Result data of the query extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences/#httperror `HttpError`}
 * @typeParam TVariables - Values for mutation function
 *
 */

export function useCreate<
    TData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TVariables = {},
>({
    resource: resourceFromProps,
    values: valuesFromProps,
    dataProviderName: dataProviderNameFromProps,
    successNotification: successNotificationFromProps,
    errorNotification: errorNotificationFromProps,
    meta: metaFromProps,
    mutationOptions = () => ({}),
}: UseCreateProps<TData, TError, TVariables> = {}) {
    const dataProvider = useDataProvider()
    const handleNotification = useHandleNotification()

    return createMutation<
        CreateResponse<TData>,
        TError,
        UseCreateParams<TData, TError, TVariables>,
        unknown
    >(() => ({
        mutationFn: ({
            resource: resourceName = resourceFromProps,
            values = valuesFromProps,
            meta = metaFromProps,
            dataProviderName = dataProviderNameFromProps,
        }: UseCreateParams<TData, TError, TVariables>) => {
            if (!values)
                throw missingValuesError
            if (!resourceName)
                throw missingResourceError

            return dataProvider(pickDataProvider(dataProviderName)).create<TData, TVariables>({
                resource: resourceName,
                variables: values,
                meta,
            })
        },
        onSuccess: (data, variables, context) => {
            const {
                resource: resourceName = resourceFromProps,
                successNotification: successNotificationFromProp = successNotificationFromProps,
                values = valuesFromProps,
            } = variables
            if (!values)
                throw missingValuesError
            if (!resourceName)
                throw missingResourceError

            const notificationConfig
        = typeof successNotificationFromProp === 'function'
            ? successNotificationFromProp(data, values)
            : successNotificationFromProp

            handleNotification(notificationConfig, {
                key: `create-notification`,
                message: `Successfully created ${resourceName}`,
                description: 'Success',
                type: 'success',
            })

            if (mutationOptions)
                mutationOptions().onSuccess?.(data, variables, context)
        },
        onError: (err: TError, variables, context) => {
            console.error(err)
            const {
                resource: resourceName = resourceFromProps,
                errorNotification: errorNotificationFromProp = errorNotificationFromProps,
                values = valuesFromProps,
            } = variables

            if (!values)
                throw missingValuesError
            if (!resourceName)
                throw missingResourceError

            const notificationConfig = typeof errorNotificationFromProp === 'function'
                ? errorNotificationFromProp(err, values)
                : errorNotificationFromProp

            handleNotification(notificationConfig, {
                key: `create-notification`,
                description: err.message,
                message: `There was an error creating ${resourceName} (status code: ${err.statusCode})`,
                type: 'error',
            })

            mutationOptions && mutationOptions().onError?.(err, variables, context)
        },
        mutationKey: keys().data().mutation('create').get(),
        ...mutationOptions(),
        meta: {
            ...(mutationOptions().meta),
        },
    }))
}

const missingResourceError = new Error(
    '[useCreate]: `resource` is not defined or not matched but is required',
)

const missingValuesError = new Error(
    '[useCreate]: `values` is not provided but is required',
)
