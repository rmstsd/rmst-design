'use client'

import { ClientOnly } from '@/components/ClientOnly'
import Client from './client'

export default function Gta6V2() {
  return (
    <ClientOnly>
      <Client />
    </ClientOnly>
  )
}
