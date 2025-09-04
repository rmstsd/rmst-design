'use client'

import { OnlyClient } from '@/components/Client'
import { useRouter } from 'next/navigation'
import { Suspense, use, useEffect, useState, useSyncExternalStore } from 'react'
import { Button, Input, Modal, TextEllipsis, useIsSSR } from 'rmst-design'

console.log('ahome mod')

export default function Home() {
  console.log('home')

  const router = useRouter()

  return (
    <div>
      <button
        onClick={() => {
          router.push('/blog')
        }}
      >
        to blog
      </button>
    </div>
  )

  return (
    <OnlyClient>
      <HomeIn />
    </OnlyClient>
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
