'use client'

import { OnlyClient } from '@/components/Client'
import { Suspense, use, useEffect, useState, useSyncExternalStore } from 'react'
import { Button, Input, Modal, TextEllipsis, useIsSSR } from 'rmst-design'

let syb = () => {
  return () => {}
}

function client() {
  return 2
}

function server() {
  return 1
}

export default function Home() {
  return (
    <OnlyClient>
      <HomeIn />
    </OnlyClient>
  )
}

const HomeIn = () => {
  const [isOpen, setIsOpen] = useState(true)

  const value = useSyncExternalStore(syb, client, server)

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
