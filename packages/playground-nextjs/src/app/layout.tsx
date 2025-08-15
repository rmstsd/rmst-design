import type { Metadata } from 'next'

import { IsSSRProvider } from 'rmst-design'
import Link from 'next/link'

import '../globals.scss'

export const metadata: Metadata = {
  title: 'rmst-nextjs',
  description: 'nextjs desc'
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html>
      <body>
        <IsSSRProvider>
          <div id="rmst-root" className="flex">
            <aside className="aside h-screen border-r flex flex-col shrink-0 p-2" style={{ width: 160 }}>
              <Link href="/">home</Link>
              <Link href="/Button">Button</Link>
              <Link href="/TextEllipsis">TextEllipsis</Link>
              <Link href="/Modal">Modal</Link>
              <Link href="/Drawer">Drawer</Link>
            </aside>

            <section className="p-2">{children}</section>
          </div>
        </IsSSRProvider>
      </body>
    </html>
  )
}
