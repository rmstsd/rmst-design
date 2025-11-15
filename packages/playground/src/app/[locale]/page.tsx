'use client'

import { startTransition, useEffect, useLayoutEffect, useRef, useState, ViewTransition } from 'react'
import { Button, useIsSSR } from 'rmst-design'
import { shuffle } from 'es-toolkit/array'

let index = 0
const bgColors = [
  '#EAE8E0', // 深奶油白
  '#A0C4D8', // 深莫兰迪蓝
  '#D6C0BD', // 深豆沙
  '#B0E0BC', // 深薄荷绿
  '#FFE0C0', // 深暖鹅黄
  '#D4D4D0', // 深雾霾灰
  '#FFD4D9', // 深樱花粉
  '#BBDDEE', // 深青蓝
  '#E0DCD2', // 深燕麦色
  '#D0CADC' // 深淡紫灰
]
function getBgColor() {
  index = (index + 1) % bgColors.length
  return bgColors[index]
}
export default function Home() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isSSR = useIsSSR()

  const [list, setList] = useState(
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'].map(item => ({
      id: item,
      bgColor: getBgColor()
    }))
  )
  const refList = useRef<HTMLDivElement[]>([])
  const prevPos = useRef<Record<string, DOMRect>>({})

  useEffect(() => {
    const timer = setInterval(() => {
      refList.current.forEach(el => {
        prevPos.current[el.id] = el.getBoundingClientRect()
      })

      setList(shuffle(list))
    }, 3000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  useLayoutEffect(() => {
    if (Object.keys(prevPos.current).length) {
      const newPos: Record<string, DOMRect> = {}
      refList.current.forEach(el => {
        newPos[el.id] = el.getBoundingClientRect()
      })

      refList.current.forEach(el => {
        const prev = prevPos.current[el.id]
        const cur = newPos[el.id]

        const dx = prev.left - cur.left
        const dy = prev.top - cur.top

        if (dx || dy) {
          el.style.transform = `translate(${dx}px, ${dy}px)`
          document.body.offsetHeight

          el.style.transition = 'transform 2s'
          el.style.transform = ''

          el.addEventListener(
            'transitionend',
            () => {
              el.style.transition = ''
              el.style.transform = ''
            },
            { once: true }
          )
        }
      })
    }
  }, [list])

  if (isSSR) {
    return null
  }

  return (
    <div>
      <Button
        onClick={() => {
          startTransition(() => {
            setVisible(!visible)
          })
        }}
      >
        Toggle
      </Button>

      <div className="flex flex-col gap-2 p-2">
        {visible && (
          <ViewTransition>
            <div className=" bg-red-100 " style={{ height: 60 }} ref={ref}>
              Input
            </div>
          </ViewTransition>
        )}

        <div className="p-3 bg-pink-100">Select</div>
        <div className="p-3 bg-orange-100">DatePicker</div>

        <hr />

        <div className="flex gap-2 flex-wrap">
          {list.map(item => (
            <div id={item.id} key={item.id} className="p-3 shrink-0 w-[50px] h-[50px] flex items-center justify-center">
              {item.id}
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {list.map((item, index) => (
            <div
              id={item.id}
              key={item.id}
              className="p-3 text-white shrink-0 w-[50px] h-[50px] flex items-center justify-center"
              ref={el => void (refList.current[index] = el)}
              style={{ backgroundColor: item.bgColor }}
            >
              {item.id}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
