'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { Button, forceReflow } from 'rmst-design'
import PageChild from './page-child'

export default function Page() {
  const [x, setX] = useState(100)
  const ref = useRef<HTMLDivElement>(null)
  const prevXRef = useRef(0)

  useLayoutEffect(() => {
    const dom = ref.current

    dom.style.transition = ''
    dom.style.transform = ''
    forceReflow()

    const rect = dom.getBoundingClientRect()

    const dx = -(rect.left - prevXRef.current)

    if (dx) {
      dom.style.transform = `translateX(${dx}px)`

      forceReflow()

      dom.style.transition = 'transform 2s'
      dom.style.transform = 'translateX(0px)'

      const handler = () => {
        dom.style.transition = ''
        dom.style.transform = ''
      }
      dom.addEventListener('transitionend', handler, { once: true })
    }
  }, [x])

  return (
    <div>
      <Button
        onClick={() => {
          prevXRef.current = ref.current.getBoundingClientRect().left
          setX(x === 100 ? 700 : 100)
        }}
      >
        按钮
      </Button>

      <div
        ref={ref}
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'red',
          marginLeft: x
        }}
      ></div>

      <PageChild />
    </div>
  )
}
