import type { ParentProps } from 'solid-js'
import { createContext } from 'solid-js'
import type { I18nProvider } from '../i18n'
import { I18nContextProvider } from '../i18n'
import type { DataProps } from '../data'
import { DataContextProvider } from '../data'

export interface RefineContext {}

export const RefineCtx = createContext<RefineContext>({} as RefineContext)

export interface RefineProps extends DataProps {
    i18nProvider?: I18nProvider
}

export function Refine(props: ParentProps<RefineProps>) {
    return (
        <RefineCtx.Provider value={{}}>
            <I18nContextProvider i18nProvider={props.i18nProvider}>
                <DataContextProvider dataProvider={props.dataProvider} notification={props.notification} errorHandler={props.errorHandler}>
                    {props.children}
                </DataContextProvider>
            </I18nContextProvider>
        </RefineCtx.Provider>
    )
}
