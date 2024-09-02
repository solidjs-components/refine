export * from './keys'
export * from './pagination'

export function pickDataProvider(dataProviderName?: string) {
    if (dataProviderName) {
        return dataProviderName
    }

    return 'default'
}
