import { useTranslations } from 'next-intl'

export async function generateMetadata({ params }) {
  const { lang } = await params
  console.log('generateMetadata lang', lang)

  return {
    title: `ahome ${lang}`
  }
}

export default function Home({ params }) {
  const t = useTranslations()

  return <div>{t('title')}</div>
}
