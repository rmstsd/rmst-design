'use client'

import { ClientOnly } from '@/components/ClientOnly'
import Client from './client'

export default function Page(props) {
  return (
    <ClientOnly>
      <Client></Client>
    </ClientOnly>
  )
}
