import { Locale } from '@/i18n-config'

import 'server-only'

const dictionaries = {
  en: () => import('@/messages/en.json').then(module => module.default),
  zh: () => import('@/messages/zh.json').then(module => module.default)
}

export const getDictionary = async (locale: Locale) => {
  console.log('getDictionary', locale)
  return dictionaries[locale]()
}
