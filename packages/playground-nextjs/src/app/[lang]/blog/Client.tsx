'use client'

import { Suspense, use, useTransition } from 'react'
import { Button, Modal } from 'rmst-design'
import { test } from './server'

export default function Client({ p }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div>
      <div>Client</div>

      <Button
        onClick={() => {
          console.log(test)
          startTransition(async () => {
            let ans = await test()
            console.log(ans)
          })
        }}
      >
        test
      </Button>

      <Child p={p} />
    </div>
  )
}

function Child({ p }) {
  console.log(p)

  let data = use(p)

  return (
    <Suspense fallback={<div>loading</div>}>
      <div>{JSON.stringify(data)}</div>
    </Suspense>
  )
}
