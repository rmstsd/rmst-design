import { ClientOnly } from '@/components/ClientOnly'
import { LdLayout } from 'rmst-design'

export default function LdLayoutDd() {
  return (
    <ClientOnly>
      <div>
        <LdLayout />
      </div>
    </ClientOnly>
  )
}
