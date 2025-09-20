'use client'

import Image from 'next/image'
import lyy from '@/assets/lyy.jpg'

import { getDictionary } from '../../dictionaries'
import { Locale } from '@/i18n-config'
import { useIntl } from '@/IntlContext'
import Counter from '@/components/Counter'

export default function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  // const { lang } = await params
  // console.log('lang', lang)
  // const dict = await getDictionary(lang) // en

  const { dict } = useIntl()

  return (
    <div className="p-4">
      <center>{dict.title}</center>

      <Counter dict={dict} />

      {/* <Image src={user.picture.large} width={100} height={100} alt="" /> */}

      {/* <Image src={lyy} alt="" style={{ objectFit: 'cover', width: 100, height: 100 }} />

      <div className="relative" style={{ width: 400, aspectRatio: 1.5 }}>
        <Image src="/lyy.jpg" alt="" fill style={{ objectFit: 'cover' }} decoding="async" />
      </div> */}

      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </div>
  )
}
