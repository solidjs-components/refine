import { useContext } from 'solid-js'

import { I18nContext } from '../I18n'

/**
 * If you need to change the locale at runtime, refine provides the `useSetLocale` hook.
 * It returns the changeLocale method from `i18nProvider` under the hood.
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/translate/useSetLocale} for more details.
 */
export function useSetLocale() {
    const { i18nProvider } = useContext(I18nContext)

    return (lang: string) => i18nProvider?.changeLocale(lang)
}
