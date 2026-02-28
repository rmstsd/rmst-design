'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { Button } from 'rmst-design'

export default function Page() {
  const [x, setX] = useState(100)
  const ref = useRef<HTMLDivElement>(null)
  const prevXRef = useRef(0)
  const transitionEndHandlerRef = useRef<(() => void) | null>(null)

  useLayoutEffect(() => {
    const dom = ref.current
    const rect = dom.getBoundingClientRect()

    const dx = -(rect.left - prevXRef.current)

    if (dx) {
      // Invert: instantly jump to the old visual position
      dom.style.transition = 'none'
      dom.style.transform = `translateX(${dx}px)`

      // Force reflow so the browser registers the instant position
      document.body.offsetTop

      // Play: animate from old position to new position
      dom.style.transition = 'transform 2s'
      dom.style.transform = ''

      // Store the handler so we can remove it if another click interrupts
      const handler = () => {
        console.log('transitionend')
        dom.style.transition = ''
        dom.style.transform = ''
        transitionEndHandlerRef.current = null
      }
      transitionEndHandlerRef.current = handler
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
    </div>
  )
}
