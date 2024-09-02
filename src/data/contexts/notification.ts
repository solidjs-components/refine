import { createContext } from 'solid-js'
import type { INotificationContext, NotificationProvider } from '../types'

export const defaultNotificationProvider: NotificationProvider = {
    open: params => console.log(params),
    close: params => console.log(params),
}

export const NotificationContext = createContext<INotificationContext>(defaultNotificationProvider)
