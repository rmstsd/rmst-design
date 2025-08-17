import type { Metadata } from 'next'
import { IsSSRProvider } from 'rmst-design'
import Side from '@/components/Side'

import '../css'

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
            <Side />

            <section className="p-2 flex-grow">{children}</section>
          </div>
        </IsSSRProvider>
      </body>
    </html>
  )
}
