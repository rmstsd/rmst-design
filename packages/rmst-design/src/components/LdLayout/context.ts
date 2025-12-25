import { noop } from 'es-toolkit'
import { createContext, use } from 'react'
import { LdStore } from './store'

export const LdContext = createContext({ rerender: noop, ldStore: new LdStore() })

export const useLd = () => use(LdContext)
