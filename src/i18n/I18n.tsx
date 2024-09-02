import type { ParentProps } from 'solid-js'
import { createContext } from 'solid-js'
import type { I18nProvider, II18nContext } from './types'

/** @deprecated default value for translation context has no use and is an empty object.  */
export const defaultProvider: Partial<I18nProvider> = {}

export const I18nContext = createContext<II18nContext>({})

export function I18nContextProvider(props: ParentProps<II18nContext>) {
    return (
        <I18nContext.Provider value={{ i18nProvider: props.i18nProvider }}>
            {props.children}
        </I18nContext.Provider>
    )
}
