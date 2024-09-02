import { useDataProvider } from './useDataProvider'

export function useApiUrl(dataProviderName?: string): string {
    const dataProvider = useDataProvider()

    const { getApiUrl } = dataProvider(
        dataProviderName,
    )

    return getApiUrl()
}
