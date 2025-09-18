import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import Link from 'next/link'
import { headers } from 'next/headers'
import { SelectTheme, ThemeProvider } from '@/components/Theme'

import '../css'

export const metadata: Metadata = {
  title: 'rmst-nextjs',
  description: 'nextjs desc'
}

type RootLayoutProps = {
  children: React.ReactNode
}

const headerHeight = 48

export default async function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children } = props

  const header = Object.fromEntries((await headers()).entries())

  return (
    <html lang={header['accept-language']} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
