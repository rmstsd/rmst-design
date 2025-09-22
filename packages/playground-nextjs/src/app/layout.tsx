import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { headers } from 'next/headers'
import { SelectTheme, ThemeProvider } from '@/components/Theme'

import '@/css'

import { Link } from '@/i18n/navigation'
import Header, { headerHeight } from '@/components/Header'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

// export async function generateStaticParams() {
//   return [{ lang: 'en' }, { lang: 'zh' }]
// }
export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export const metadata: Metadata = {
  title: 'rmst-nextjs',
  description: 'nextjs desc'
}

type RootLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export default async function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children, params } = props

  const header = Object.fromEntries((await headers()).entries())

  const { locale, lang } = await params

  console.log('RootLayout locale', lang)

  setRequestLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider>
            <div id="rmst-root">
              <Header />

              <div style={{ paddingTop: headerHeight }}>{children}</div>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
