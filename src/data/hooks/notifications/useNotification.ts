import { useContext } from 'solid-js'

import { NotificationContext } from '../../contexts/notification.ts'
import type { INotificationContext } from '../../types'

export function useNotification(): INotificationContext {
    const { open, close } = useContext(NotificationContext)

    return { open, close }
}
