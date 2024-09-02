import { useContext } from 'solid-js'
import type { HttpError } from '../types'
import { ErrorHandlerContext } from '../contexts/error.ts'

export type ErrorHandler = (error: HttpError) => void

export const defaultErrorHandler: ErrorHandler = (err: HttpError) => {
    console.error(err)
}

export function useHandleError() {
    const { errorHandler } = useContext(ErrorHandlerContext)
    const handler = (err: Error) => {
        const error = err as unknown as HttpError
        if (errorHandler) {
            errorHandler(error)
            return
        }
        defaultErrorHandler(error)
    }

    return { handler }
}
