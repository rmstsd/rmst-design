import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params

  return {
    title: `ahome ${locale}`
  }
}

const list = Array.from({ length: 10 }, (_, index) =>
  Math.random()
    .toString(36)
    .repeat(Math.round(Math.random() * 8))
)

export default async function Home({ params }) {
  const { locale } = await params
  const t = await getTranslations()

  return (
    <div>
      <div className="flex p-7 relative">
        <span className="absolute bottom-0 top-0" style={{ width: 20, backgroundColor: 'red' }}></span>
        <span draggable>12345</span>
        <span style={{ width: 20, backgroundColor: 'red' }}></span>
      </div>
    </div>
  )

  return (
    <div>
      <p>{t('title')}</p>

      <p>lang: {locale}</p>

      <hr />
      <div style={{ columns: 3, columnGap: 10 }} className="p-4">
        {list.map((item, index) => (
          <div key={index} className="p-2 border break-all" style={{ marginBottom: 10, breakInside: 'avoid' }}>
            <div>{index}</div>

            <div>{item}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
