'use client'

import { Suspense, use, useTransition } from 'react'
import { Button, Modal } from 'rmst-design'
import { test } from './server'

export default function Client() {
  const [isPending, startTransition] = useTransition()

  return (
    <div>
      <div>Client</div>
    </div>
  )
}

function Child({ p }) {
  let data = use(p)

  return (
    <Suspense fallback={<div>loading</div>}>
      <div>{JSON.stringify(data)}</div>
    </Suspense>
  )
}
