import { useContext } from 'solid-js'
import { isEmpty } from 'radash'
import { DataContext } from '../contexts/data'
import type { DataProvider } from '../types'

export function useDataProvider(): ((dataProviderName?: string) => DataProvider) {
    const context = useContext(DataContext)

    return (dataProviderName?: string) => {
        if (dataProviderName) {
            const dataProvider = context?.[dataProviderName]
            if (!dataProvider) {
                throw new Error(`"${dataProviderName}" Data provider not found`)
            }

            if (dataProvider && !context?.default) {
                throw new Error(
                    'If you have multiple data providers, you must provide default data provider property',
                )
            }

            return context[dataProviderName]
        }

        if (context.default && !isEmpty(context.default)) {
            return context.default
        }

        throw new Error(
            `There is no "default" data provider. Please pass dataProviderName.`,
        )
    }
}
