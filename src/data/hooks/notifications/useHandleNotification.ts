import type { OpenNotificationParams } from '../../types'
import { useNotification } from './useNotification.ts'

export function useHandleNotification() {
    const { open } = useNotification()

    return (
        notification: OpenNotificationParams | false | undefined,
        fallbackNotification?: OpenNotificationParams,
    ) => {
        if (notification !== false) {
            if (notification) {
                open?.(notification)
            }
            else if (fallbackNotification) {
                open?.(fallbackNotification)
            }
        }
    }
}
