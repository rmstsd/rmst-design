import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
