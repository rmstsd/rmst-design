'use client'

import { startTransition, useEffect, useInsertionEffect, useLayoutEffect, useRef, useState, ViewTransition } from 'react'
import { Button, useIsSSR } from 'rmst-design'
import { shuffle } from 'es-toolkit/array'

import './home.css'

let bIndex = 0
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
  bIndex = (bIndex + 1) % bgColors.length
  return bgColors[bIndex]
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
  const prevPos = useRef<Record<string, { left: number; top: number }>>({})

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     refList.current.forEach(el => {
  //       prevPos.current[el.id] = { left: el.offsetLeft, top: el.offsetTop }
  //     })

  //     // setList(shuffle(list))
  //   }, 3000)

  //   return () => {
  //     clearInterval(timer)
  //   }
  // }, [])

  const dRef = useRef(false)

  useLayoutEffect(() => {
    if (Object.keys(prevPos.current).length) {
      console.log('ddd')
      dRef.current = true
      const newPos: Record<string, { left: number; top: number }> = {}
      refList.current.forEach(el => {
        newPos[el.id] = { left: el.offsetLeft, top: el.offsetTop }
      })

      refList.current.forEach(el => {
        const prev = prevPos.current[el.id]
        const cur = newPos[el.id]

        if (!prev || !cur) {
          return
        }

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
              dRef.current = false
            },
            { once: true }
          )
        }
      })
    }

    refList.current.forEach(el => {
      prevPos.current[el.id] = { left: el.offsetLeft, top: el.offsetTop }
    })
  }, [list])

  const [a, setA] = useState(false)

  const domRef = useRef<HTMLDivElement>(null)
  const abCtRef = useRef<AbortController>(new AbortController())

  let oldRef = useRef(0)

  const dong = () => {
    const t2 = domRef.current
    const newLeft = domRef.current.offsetLeft
    t2.style.transform = `translateX(${oldRef.current - newLeft}px)`

    t2.offsetTop

    t2.style.transition = 'all 0.5s'
    t2.style.transform = 'translateX(0)'

    abCtRef.current.abort()
    abCtRef.current = new AbortController()

    t2.addEventListener(
      'transitionend',
      () => {
        t2.style.transition = ''
        t2.style.transform = ''

        abCtRef.current.abort()
      },
      { signal: abCtRef.current.signal }
    )
  }

  if (isSSR) {
    return null
  }

  return (
    <div>
      <Button onClick={() => dong()}>动</Button>

      <Button
        onClick={() => {
          setA(!a)

          oldRef.current = domRef.current.offsetLeft
          setTimeout(() => {
            dong()
          }, 0)
        }}
      >
        set
      </Button>

      <div className="flex gap-6 pl-24">
        {a && <div className="border mr-3 w-9">a</div>}

        <div
          ref={domRef}
          className="test-2 p-3 text-white shrink-0 w-[50px] h-[50px] flex items-center justify-center bg-pink-500"
        >
          哈哈
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2 items-start">
        <div>
          <Button
            onClick={() => {
              // 随机插入一个元素
              setList(prev => {
                const randomIndex = Math.floor(Math.random() * prev.length)
                const randomItem = Math.random().toString(36).substring(2, 6)
                return [...prev.slice(0, randomIndex), { id: randomItem, bgColor: getBgColor() }, ...prev.slice(randomIndex)]
              })
            }}
          >
            插入
          </Button>

          <Button
            onClick={() => {
              setList(shuffle(list))
            }}
          >
            洗牌
          </Button>
        </div>

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

        {/* <div className="flex gap-2 flex-wrap">
          {list.map(item => (
            <ViewTransition key={item.id}>
              <div
                className="p-3 text-white shrink-0 w-[50px] h-[50px] flex items-center justify-center"
                style={{ backgroundColor: item.bgColor }}
              >
                {item.id}
              </div>
            </ViewTransition>
          ))}
        </div> */}

        <IPhone />
      </div>
    </div>
  )
}

const list = ['aa', 'b', 'ccc', 'ddddd']

const IPhone = () => {
  const [active, setActive] = useState('')

  const refList = useRef<HTMLDivElement[]>([])
  const prevPos = useRef<DOMRect[]>(null)

  useLayoutEffect(() => {
    if (!prevPos.current) {
      prevPos.current = refList.current.map(item => item.getBoundingClientRect())

      return
    }

    const newPos = refList.current.map(item => item.getBoundingClientRect())

    newPos.forEach((newItem, index) => {
      const oldItem = prevPos.current[index]

      const el = refList.current[index]

      const dx = oldItem.width - newItem.width
      const dy = oldItem.height - newItem.height

      if (dx || dy) {
        el.style.width = `${oldItem.width}px`
        el.style.height = `${oldItem.height}px`

        document.body.offsetHeight

        el.style.transition = 'width 300ms, height 300ms'
        el.style.transitionTimingFunction = 'cubic-bezier(0.27, 0.30, 0.56, 1.46)'
        el.style.width = `${newItem.width}px`
        el.style.height = `${newItem.height}px`
        el.style.color = 'transparent'

        el.addEventListener(
          'transitionend',
          () => {
            el.style.transition = ''
            el.style.height = ``
            el.style.color = 'black'
          },
          { once: true }
        )
      }
    })

    prevPos.current = newPos
  }, [active])

  return (
    <div className="m-6 flex gap-2 flex-col items-start p-6 border">
      {list.map((item, index) => (
        <div
          key={item}
          className="p-2 shrink-0 flex items-center justify-center bg-pink-100 break-all overflow-clip"
          style={{ width: active === item ? '100px' : '' }}
          onClick={() => setActive(item)}
          ref={el => void (refList.current[index] = el)}
        >
          {active === item ? item.repeat(20) : item}
        </div>
      ))}
    </div>
  )
}
