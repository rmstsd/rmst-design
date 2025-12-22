import { noop } from 'es-toolkit'
import { createContext, use } from 'react'

export const LdContext = createContext({ rerender: noop })

export const useLd = () => use(LdContext)
