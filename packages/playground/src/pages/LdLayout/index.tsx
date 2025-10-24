import { LdLayout, useIsSSR } from 'rmst-design'

export default function LdLayoutDd() {
  const isSSR = useIsSSR()

  if (isSSR) {
    return null
  }

  return (
    <div>
      <LdLayout />
    </div>
  )
}
