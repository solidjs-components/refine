import { createContext } from 'solid-js'
import type { DataProvider, DataProviders, IDataContext } from '../types'

export const defaultDataProvider: DataProviders = {
    default: {} as DataProvider,
}

export const DataContext = createContext<IDataContext>(defaultDataProvider)
