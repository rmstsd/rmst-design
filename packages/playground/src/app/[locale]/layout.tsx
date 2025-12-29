import type { Metadata, Viewport } from 'next'
import { Locale, NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from '@/components/Theme'
import Header, { headerHeight } from '@/components/Header'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

import '@/css'

export function generateStaticParams() {
  const staticParams = routing.locales.map(locale => ({ locale }))

  return staticParams
}

export const metadata: Metadata = {
  title: 'rmst-nextjs',
  description: 'nextjs desc'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false
}

type RootLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
  modal: React.ReactNode
}

export default async function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children, params, modal } = props

  // 调用 headers 会使 static render 失效
  // const header = Object.fromEntries((await headers()).entries())

  const { locale } = await params

  console.log('RootLayout locale', locale)

  setRequestLocale(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider>
            <div id="rmst-root">
              <Header />

              {modal}

              <div style={{ paddingTop: headerHeight }}>{children}</div>
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
