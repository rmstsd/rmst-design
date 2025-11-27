import { Children, cloneElement, PropsWithChildren, ReactElement, useLayoutEffect, useRef } from 'react'

export default function TransitionGroup(props: PropsWithChildren) {
  const { children } = props

  const domMapRef = useRef<Map<string, HTMLDivElement>>(new Map())
  const oldPosRef = useRef<Record<string, { left: number; top: number }>>({})

  const childList = Children.toArray(children).map((item: ReactElement) => {
    return cloneElement(item, {
      // @ts-ignore
      ref: el => {
        domMapRef.current.set(item.key, el)
      }
    })
  })

  useLayoutEffect(() => {
    const newPosition: Record<string, { left: number; top: number }> = {}
    domMapRef.current.forEach((el, key) => {
      newPosition[key] = { left: el.offsetLeft, top: el.offsetTop }
    })

    for (const [key, el] of domMapRef.current) {
      const oldPos = oldPosRef.current[key]
      const newPos = newPosition[key]

      const prev = oldPos
      const cur = newPos

      if (!prev || !cur) {
        continue
      }

      // 如果在运动过程中, 让其立刻到终点
      el.style.transition = ''
      forceReflow()

      const dx = prev.left - cur.left
      const dy = prev.top - cur.top

      if (dx || dy) {
        el.style.transform = `translate(${dx}px, ${dy}px)`
        forceReflow()

        el.style.transition = 'transform 0.3s'
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
    }

    oldPosRef.current = newPosition
  })

  return <div className="flex flex-col gap-4 self-stretch">{childList}</div>
}

function forceReflow() {
  document.body.offsetHeight
}
