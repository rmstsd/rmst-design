'use client'

import { ClientOnly } from '@/components/ClientOnly'
import Client from './client'
import { VideoTest } from './test/video'

export default function Gta6V2() {
  return (
    <ClientOnly>
      <Client />

      {/* <VideoTest /> */}
    </ClientOnly>
  )
}
