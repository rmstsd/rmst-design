import { useTranslations } from 'next-intl'
import Image from 'next/image'

import lyy from '@/assets/lyy.jpg'
import { getTranslations } from 'next-intl/server'

export default async function Home() {
  // random user
  const res = await fetch('https://randomuser.me/api/')
  const data = await res.json()
  const user = data.results[0]

  // const t = await useTranslations('HomePage')
  const t = await getTranslations('HomePage')

  return (
    <div className="p-4">
      <center>{t('title')}</center>

      <Image src={user.picture.large} width={100} height={100} alt="" />

      <Image src={lyy} alt="" style={{ objectFit: 'cover', width: 100, height: 100 }} />

      <div className="relative" style={{ width: 400, aspectRatio: 1.5 }}>
        <Image src="/lyy.jpg" alt="" fill style={{ objectFit: 'cover' }} decoding="async" />
      </div>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
