import type { Metadata } from 'next'
import '@/css'
import './style.scss'

export const metadata: Metadata = {
  title: 'nl'
}

type RootLayoutProps = {
  children: React.ReactNode
}

export default async function RootLayout(props: Readonly<RootLayoutProps>) {
  const { children } = props

  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
