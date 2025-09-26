import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params

  return {
    title: `ahome ${locale}`
  }
}

import Image from 'next/image'

export default async function Home({ params }) {
  const { locale } = await params
  const t = await getTranslations()

  return (
    <div>
      <p>{t('title')}</p>

      <p>lang: {locale}</p>
    </div>
  )
}
