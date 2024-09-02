import type { SolidMutationOptions } from '@tanstack/solid-query'
import { createMutation } from '@tanstack/solid-query'
import type { MaybeAccessor } from '@solidjs-components/utils'
import { access } from '@solidjs-components/utils'

import type {
    BaseRecord,
    CreateResponse,
    HttpError,
    MetaQuery,
    Prettify,
    SuccessErrorNotification,
    UseMutationResult,
} from '../types'
import { keys } from '../utils'
import { useTranslate } from '../../i18n'
import { useHandleNotification } from './notifications/useHandleNotification'
import { useDataProvider } from './useDataProvider.tsx'

interface UseCustomMutationConfig {
    headers?: {}
}

type useCustomMutationParams<TData, TError, TVariables> = {
    url: string
    method: 'post' | 'put' | 'patch' | 'delete'
    values: TVariables
    /**
     * Meta data for `dataProvider`
     */
    meta?: MetaQuery
    dataProviderName?: string
    config?: UseCustomMutationConfig
} & SuccessErrorNotification<
    CreateResponse<TData>,
    TError,
    Prettify<UseCustomMutationConfig & MetaQuery>
>

export type UseCustomMutationReturnType<
    TData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TVariables = {},
> = UseMutationResult<
    CreateResponse<TData>,
    TError,
    useCustomMutationParams<TData, TError, TVariables>,
    unknown
>

export type UseCustomMutationProps<
    TData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TVariables = {},
> = {
    mutationOptions?: MaybeAccessor<Omit<
        SolidMutationOptions<
            CreateResponse<TData>,
            TError,
            useCustomMutationParams<TData, TError, TVariables>,
            unknown
        >,
        'mutationFn' | 'onError' | 'onSuccess'
    >>
}

/**
 * `useCustomMutation` is a modified version of `react-query`'s {@link https://react-query.tanstack.com/reference/useMutation `useMutation`} for create mutations.
 *
 * It uses the `custom` method from the `dataProvider` which is passed to `<Refine>`.
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/data/useCustomMutation} for more details.
 *
 * @typeParam TData - Result data of the query extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences#baserecord `BaseRecord`}
 * @typeParam TError - Custom error object that extends {@link https://refine.dev/docs/api-reference/core/interfaceReferences/#httperror `HttpError`}
 * @typeParam TVariables - Values for mutation function
 *
 */

export function useCustomMutation<
    TData extends BaseRecord = BaseRecord,
    TError extends HttpError = HttpError,
    TVariables = {},
>({ mutationOptions }: UseCustomMutationProps<TData, TError, TVariables> = {}) {
    const handleNotification = useHandleNotification()
    const dataProvider = useDataProvider()
    const translate = useTranslate()

    // const { url, method, values, meta, dataProviderName, config } = access(mutationOptions)
    // const { url, method, values, meta, dataProviderName, config } = mutationOptions

    return createMutation<CreateResponse<TData>, TError, useCustomMutationParams<TData, TError, TVariables>, unknown>(
        () => {
            return {
                mutationFn: ({ url, method, values, meta, dataProviderName, config }) => {
                    const { custom } = dataProvider(dataProviderName)

                    if (!custom) {
                        throw new Error('Not implemented custom on data provider.')
                    }
                    return custom<TData>({
                        url,
                        method,
                        payload: values,
                        meta,
                        headers: { ...config?.headers },
                    })
                },
                onSuccess: (
                    data,
                    {
                        successNotification: successNotificationFromProp,
                        config,
                        meta,
                    },
                ) => {
                    const notificationConfig
                  = typeof successNotificationFromProp === 'function'
                      ? successNotificationFromProp(data, {
                          ...config,
                          ...meta || {},
                      })
                      : successNotificationFromProp

                    handleNotification(notificationConfig)
                },
                onError: (
                    err: TError,
                    {
                        errorNotification: errorNotificationFromProp,
                        method,
                        config,
                        meta,
                    },
                ) => {
                    const notificationConfig = typeof errorNotificationFromProp === 'function'
                        ? errorNotificationFromProp(err, {
                            ...config,
                            ...(meta || {}),
                        })
                        : errorNotificationFromProp

                    handleNotification(notificationConfig, {
                        key: `${method}-notification`,
                        message: translate(
                            'notifications.error',
                            { statusCode: err.statusCode },
                            `Error (status code: ${err.statusCode})`,
                        ),
                        description: err.message,
                        type: 'error',
                    })
                },
                mutationKey: keys()
                    .data()
                    .mutation('customMutation')
                    .get(),
                ...access(mutationOptions),
                meta: {
                    ...access(mutationOptions)?.meta,
                },
            }
        },
    )
}
