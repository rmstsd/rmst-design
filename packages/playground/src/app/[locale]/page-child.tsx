'use client'

import { shuffle } from 'es-toolkit'
import { useLayoutEffect, useRef, useState } from 'react'
import { Button, forceReflow } from 'rmst-design'

export default function PageChild() {
  const [list, setList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9])

  const domsRef = useRef<Record<number, HTMLDivElement>>({})
  const prevPosRef = useRef<Record<number, { left: number; top: number }>>({})

  useLayoutEffect(() => {
    for (const key in domsRef.current) {
      const prevItem = prevPosRef.current[key]
      if (!prevItem) continue

      const element = domsRef.current[key]

      element.style.transition = ''
      element.style.transform = ``
      forceReflow()

      const rect = element.getBoundingClientRect()
      const dx = prevItem.left - rect.left
      const dy = prevItem.top - rect.top

      if (dx || dy) {
        element.style.transform = `translate(${dx}px, ${dy}px)`

        forceReflow()

        element.style.transition = 'transform 2s'
        element.style.transform = `translate(${0}px, ${0}px)`

        element.addEventListener(
          'transitionend',
          () => {
            element.style.transition = ''
            element.style.transform = ''
          },
          { once: true }
        )
      }
    }
  }, [list])

  return (
    <div>
      <Button
        onClick={() => {
          for (const key in domsRef.current) {
            const dom = domsRef.current[key]
            const rect = dom.getBoundingClientRect()
            prevPosRef.current[key] = { left: rect.left, top: rect.top }
          }

          setList(shuffle([...list]))
        }}
      >
        按钮
      </Button>

      <div className="grid gap-6 grid-cols-3">
        {list.map(item => (
          <div
            key={item}
            ref={el => {
              domsRef.current[item] = el
            }}
            style={{ width: 100, height: 100, backgroundColor: `hsl(${item * 100}, 100%, 30%)` }}
          ></div>
        ))}
      </div>
    </div>
  )
}
