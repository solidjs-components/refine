import { createContext } from 'solid-js'
import type { ErrorHandler } from '../hooks/useHandleError.ts'
import { defaultErrorHandler } from '../hooks/useHandleError.ts'

export const ErrorHandlerContext = createContext<{ errorHandler: ErrorHandler }>({
    errorHandler: defaultErrorHandler,
})
