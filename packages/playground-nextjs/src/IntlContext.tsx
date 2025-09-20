'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { Locale } from './i18n-config'

interface ContextValue {
  lang: Locale
  dict: Record<string, string>
}

const Context = createContext<ContextValue>({ lang: 'zh', dict: {} })

export const IntlContext = (props: PropsWithChildren<{ lang: Locale; dict }>) => {
  const { lang, dict, children } = props

  return <Context value={{ lang, dict }}>{children}</Context>
}

export const useIntl = () => useContext(Context)
