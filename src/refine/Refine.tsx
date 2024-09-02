import type { ParentProps } from 'solid-js'
import { createContext } from 'solid-js'
import type { I18nProvider } from '../i18n'
import { I18nContextProvider } from '../i18n'

export interface RefineContext {}

export const RefineCtx = createContext<RefineContext>({} as RefineContext)

export interface RefineProps {
    i18nProvider?: I18nProvider
}

export function Refine(props: ParentProps<RefineProps>) {
    return (
        <RefineCtx.Provider value={{}}>
            <I18nContextProvider i18nProvider={props.i18nProvider}>
                {props.children}
            </I18nContextProvider>
        </RefineCtx.Provider>
    )
}
