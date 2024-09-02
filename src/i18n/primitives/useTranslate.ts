import { useContext } from 'solid-js'
import { I18nContext } from '../I18n'

/**
 * If you need to translate the texts in your own components, refine provides the `useTranslate` hook.
 * It returns the translation method from `i18nProvider` under the hood.
 *
 * @see {@link https://refine.dev/docs/api-reference/core/hooks/translate/useTranslate} for more details.
 */
export function useTranslate() {
    const { i18nProvider } = useContext(I18nContext)

    function translate(key: string, options?: any, defaultMessage?: string): string
    function translate(key: string, defaultMessage?: string): string
    function translate(key: string, options?: string | any, defaultMessage?: string) {
        return (
            i18nProvider?.translate(key, options, defaultMessage)
            ?? defaultMessage
            ?? (typeof options === 'string' && typeof defaultMessage === 'undefined'
                ? options
                : key)
        )
    }

    return translate
}
