'use client'

import { useRouter } from 'next/navigation'
import { Suspense, use, useEffect, useState, useSyncExternalStore } from 'react'
import { Button, Input, Modal, TextEllipsis, useIsSSR } from 'rmst-design'
import { getDictionary } from '../../../dictionaries'
import { useIntl } from '@/IntlContext'

export default function Home({ params }) {
  const { lang } = useIntl()

  // console.log('Home lang', lang)

  // const { lang } = params

  const router = useRouter()

  return (
    <div>
      {/* <center>{dict.title}</center> */}

      <button
        onClick={() => {
          router.push('/blog')
        }}
      >
        to blog
      </button>
    </div>
  )
}

const HomeIn = () => {
  const [isOpen, setIsOpen] = useState(true)

  const p = new Promise<number>(resolve => {
    setTimeout(() => {
      resolve(1)
    }, 1000)
  })

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>aaa</Button>

      <Suspense fallback={<div>loading</div>}>
        <Child p={p} />
      </Suspense>
    </div>
  )
}

const Child = (props: { p: Promise<number> }) => {
  const data = use(props.p)

  return <div>{data}</div>
}
