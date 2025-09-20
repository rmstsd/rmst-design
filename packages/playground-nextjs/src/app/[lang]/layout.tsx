import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import Link from 'next/link'
import { headers } from 'next/headers'
import { SelectTheme, ThemeProvider } from '@/components/Theme'
import { Locale } from '@/i18n-config'

import '@/css'
import { getDictionary } from '@/dictionaries'
import { IntlContext } from '@/IntlContext'

// export async function generateStaticParams() {
//   return [{ lang: 'en' }, { lang: 'zh' }]
// }

export const metadata: Metadata = {
  title: 'rmst-nextjs',
  description: 'nextjs desc'
}

type RootLayoutProps = {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}

const headerHeight = 48

export default async function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children, params } = props

  const header = Object.fromEntries((await headers()).entries())

  const { lang } = await params

  const dict = await getDictionary(lang)
  console.log(dict)

  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        <IntlContext lang={lang} dict={dict}>
          <ThemeProvider>
            <div id="rmst-root">
              <header
                className="site-header border-b flex items-center px-2 fixed top-0 w-full z-10 gap-2"
                style={{ height: headerHeight }}
              >
                <Link href="/">首页</Link>

                <Link href="/components/Button">组件</Link>

                <Link href="/ahome">ahome</Link>
                <Link href="/blog">blog</Link>

                <SelectTheme />
              </header>

              <div style={{ paddingTop: headerHeight }}>{children}</div>
            </div>
          </ThemeProvider>
        </IntlContext>
      </body>
    </html>
  )
}
