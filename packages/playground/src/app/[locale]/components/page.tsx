import { redirect } from '@/i18n/navigation'
import { permanentRedirect } from 'next/navigation'
import { use } from 'react'

export default function Home(props: PageProps<`/[locale]`>) {
  const { locale } = use(props.params)

  return permanentRedirect(`/${locale}/components/LdLayout`)

  return redirect({ href: '/components/LdLayout', locale })
}
