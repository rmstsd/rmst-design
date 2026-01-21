import { ClientOnly } from '@/components/ClientOnly'

import type { Metadata } from 'next'
import '@/css'
import './style.scss'

export const metadata: Metadata = {
  title: 'spa'
}

export default function Layout(props) {
  return (
    <html suppressHydrationWarning>
      <body className="p-2">
        <ClientOnly>{props.children}</ClientOnly>
      </body>
    </html>
  )
}
