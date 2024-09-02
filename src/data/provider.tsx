import type { ParentProps } from 'solid-js'
import { createMemo } from 'solid-js'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import type { DataProvider, DataProviders, NotificationProvider } from './types'
import { DataContext, defaultDataProvider } from './contexts/data'
import { NotificationContext, defaultNotificationProvider } from './contexts/notification'
import type { ErrorHandler } from './hooks/useHandleError.ts'
import { useHandleError } from './hooks/useHandleError.ts'
import { ErrorHandlerContext } from './contexts/error.ts'

type Props = ParentProps<{
    dataProvider?: DataProvider | DataProviders
    notification?: NotificationProvider
    errorHandler?: ErrorHandler
}>

export function DataContextProvider(props: Props) {
    const providerValue = createMemo(() => {
        if (props.dataProvider) {
            if (
                !('default' in props.dataProvider)
                && ('getList' in props.dataProvider || 'getOne' in props.dataProvider)
            ) {
                return {
                    default: props.dataProvider,
                }
            }
            else {
                return props.dataProvider
            }
        }
        return defaultDataProvider
    })

    const { handler } = useHandleError()
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: e => handler(e),
        }),
        mutationCache: new MutationCache({
            onError: e => handler(e),
        }),
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return (
        <QueryClientProvider client={queryClient}>
            <ErrorHandlerContext.Provider value={{ errorHandler: props.errorHandler }}>
                <DataContext.Provider value={providerValue()}>
                    <NotificationContext.Provider value={props.notification || defaultNotificationProvider}>
                        {props.children}
                    </NotificationContext.Provider>
                </DataContext.Provider>
            </ErrorHandlerContext.Provider>
        </QueryClientProvider>
    )
}
