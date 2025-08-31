import { createContext, PropsWithChildren, RefObject, useLayoutEffect, useRef, useState } from 'react'

import { useLatest, usePrevious } from 'ahooks'
import { Updater, useImmer } from 'use-immer'
import { cloneDeep } from 'es-toolkit'

const initialValue = {
  ttMap: { t1: { open: false, shouldMount: false, floatDom: null, animate: null } }
}

const openKfs = [
  { transform: 'translateY(10px)', opacity: 0 },
  { transform: 'translateY(0)', opacity: 1 }
]

const closeKfs = [
  { transform: 'translateY(0)', opacity: 1 },
  { transform: 'translateY(10px)', opacity: 0 }
]

const options: KeyframeAnimationOptions = { duration: 500, fill: 'forwards', easing: 'ease' }

export type TtMapValue = { open: boolean; shouldMount: boolean }

export type StateValue = {
  ttMap: Record<string, TtMapValue>
  prevTtMap: Record<string, TtMapValue>
  openName: string
  closeName: string
}

type DomMap = Record<string, { floatDom: HTMLDivElement; animation: Animation }>

type Value = { stateRef: RefObject<StateValue>; domMapRef: RefObject<DomMap>; update: () => void }

export const TooltipContext = createContext(null as Value)

export const TooltipProvider = (props: PropsWithChildren) => {
  const stateRef = useRef({ ttMap: {}, prevTtMap: {}, openName: '', closeName: '' } as StateValue)

  const prevTtRefMap = useRef(stateRef.current.ttMap)

  const domMapRef = useRef({} as DomMap)

  const [_, _update] = useState([])
  const update = () => _update([])

  // useLayoutEffect(() => {
  //   // mapOpen 有两个为 true 的时候
  //   if (Object.values(mapOpen).filter(item => item).length === 2) {
  //     const keys = Object.keys(mapOpen).filter(k => mapOpen[k])

  //     const openName = stateRef.current.openName

  //     const prevName = keys.find(k => k !== openName)
  //     console.log(prevName, openName)

  //     const f_dom = floatingMapRef.current[prevName]
  //     const l_dom = floatingMapRef.current[openName]

  //     console.log(f_dom)
  //     console.log(l_dom)

  //     // 等 openName 的 dom 渲染完成, 位置计算完成
  //     requestAnimationFrame(() => {
  //       let f = f_dom.getBoundingClientRect()
  //       let l = l_dom.getBoundingClientRect()
  //       console.log(f)
  //       console.log(l)

  //       f_dom.style.setProperty('overflow', 'hidden')
  //       f_dom.style.setProperty('white-space', 'nowrap')
  //       const f_ani = f_dom.animate(
  //         [
  //           { left: toPx(f.left), top: toPx(f.top), width: toPx(f.width), height: toPx(f.height), opacity: 1 },
  //           { left: toPx(l.left), top: toPx(l.top), width: toPx(l.width), height: toPx(l.height), opacity: 0 }
  //         ],
  //         options
  //       )
  //       f_ani.onfinish = () => {
  //         f_dom.style.setProperty('overflow', '')
  //         f_dom.style.setProperty('white-space', '')
  //       }

  //       l_dom.style.setProperty('overflow', 'hidden')
  //       l_dom.style.setProperty('white-space', 'nowrap')
  //       const l_ani = l_dom.animate(
  //         [
  //           { left: toPx(f.left), top: toPx(f.top), width: toPx(f.width), height: toPx(f.height), opacity: 0 },
  //           { left: toPx(l.left), top: toPx(l.top), width: toPx(l.width), height: toPx(l.height), opacity: 1 }
  //         ],
  //         options
  //       )
  //       l_ani.onfinish = () => {
  //         l_dom.style.setProperty('overflow', '')
  //         l_dom.style.setProperty('white-space', '')

  //         setMapOpen({ ...mapOpen, [prevName]: false })
  //       }
  //     })
  //   }
  // }, [mapOpen])

  useLayoutEffect(() => {
    const { ttMap, prevTtMap, openName, closeName } = stateRef.current
    if (!openName) {
      return
    }

    const open = ttMap[openName].open
    const prevOpen = prevTtMap[openName].open

    const domMap = domMapRef.current[openName]

    if (prevTtRefMap.current) {
      console.log(prevTtRefMap.current)
      const kk = Object.keys(ttMap).filter(k => ttMap[k].open !== prevTtRefMap.current[k].open)
      console.log(kk)

      prevTtRefMap.current = cloneDeep(ttMap)
    }

    return

    Object.keys(ttMap).forEach(name => {
      const open = ttMap[name].open
      const prevOpen = prevTtMap[name].open

      if (prevOpen !== open) {
        const currDom = domMapRef.current[name]

        currDom.animation?.cancel()

        if (open) {
          console.log('open')

          currDom.animation = currDom.floatDom.animate(openKfs, options)
          prevTtMap[openName].open = open
        } else {
          console.log('close')

          currDom.animation = currDom.floatDom.animate(closeKfs, options)
          prevTtMap[openName].open = open
          currDom.animation.onfinish = () => {
            console.log('ggg')
            stateRef.current.ttMap[openName].shouldMount = false

            update()
          }
        }
      }
    })
  }, [_])

  console.log(stateRef.current.ttMap)

  return <TooltipContext value={{ stateRef, domMapRef, update }}>{props.children}</TooltipContext>
}

const toPx = (value: number) => {
  return `${value}px`
}
