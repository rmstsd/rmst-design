import type { Metadata } from 'next'
import './style.scss'

export const metadata: Metadata = {
  title: 'gta6-v2'
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
