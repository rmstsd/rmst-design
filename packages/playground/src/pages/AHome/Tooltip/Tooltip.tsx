import { useClick, useDismiss, useFloating, useHover, useInteractions } from '@floating-ui/react'
import { cloneElement, PropsWithChildren, ReactNode, use, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { Portal } from 'rmst-design'
import { cloneDeep } from 'es-toolkit'
import { useMemoizedFn } from 'ahooks'

const defaultOpenKfs = [
  { transform: 'translateY(100px)', opacity: 0 },
  { transform: 'translateY(0)', opacity: 1 }
]
const options: KeyframeAnimationOptions = { duration: 2000, fill: 'forwards' }

interface Props extends PropsWithChildren {
  name?: string
  content?: ReactNode
}

const toPx = (value: number) => {
  return `${value}px`
}

const mm = {}

let prevClosedName

export default function Tooltip(props: Props) {
  const { name, children, content } = props

  const [isOpen, setIsOpen] = useState(false)

  const nextTickOpen = useMemoizedFn(() => {
    const otherNames = Object.keys(mm).filter(k => k !== name)
    const hasOther = otherNames.length > 0

    aniRef.current?.pause()

    if (hasOther) {
      const thisRect = endDomRectRef.current
      const endKf = {
        left: toPx(thisRect.left),
        top: toPx(thisRect.top),
        width: toPx(thisRect.width),
        height: toPx(thisRect.height)
      }

      for (const otName of otherNames) {
        const otherState = mm[otName].getState()

        const otherDom = otherState.floatDomRef.current
        const otherRect = otherDom.getBoundingClientRect()

        const kfs: Keyframe[] = [
          { left: toPx(otherRect.left), top: toPx(otherRect.top), width: toPx(otherRect.width), height: toPx(otherRect.height) },
          endKf
        ]

        const openKfs = cloneDeep(kfs)
        openKfs[0].opacity = 0
        openKfs[1].opacity = 1

        const closeKfs = cloneDeep(kfs)
        closeKfs[0].opacity = 1
        closeKfs[1].opacity = 0

        console.log(openKfs)

        aniRef.current = floatDomRef.current.animate(openKfs, options)
        aniRef.current.onfinish = () => {
          aniRef.current = null
        }

        // 关闭上一个
        otherState.aniRef.current?.cancel()
        otherState.aniRef.current = otherDom.animate(closeKfs, options)
        otherState.aniRef.current.onfinish = () => {
          otherState.setShouldMount(false)
          otherState.aniRef.current = null
          Reflect.deleteProperty(mm, otName)
        }
      }
    } else {
      // 如果已经在运动中, 则有起点, 只需更新终点
      if (aniRef.current) {
        aniRef.current = floatDomRef.current.animate(defaultOpenKfs[1], options)
        aniRef.current.onfinish = () => {
          aniRef.current = null
        }
      } else {
        aniRef.current = floatDomRef.current.animate(defaultOpenKfs, options)
        aniRef.current.onfinish = () => {
          aniRef.current = null
        }
      }
    }
  })

  const nextTickClose = useMemoizedFn(() => {
    for (const key in mm) {
      const item = mm[key]

      const state = item.getState()

      state.aniRef.current?.pause()

      state.aniRef.current = state.floatDomRef.current.animate(defaultOpenKfs[0], options)
      state.aniRef.current.onfinish = () => {
        state.setShouldMount(false)
        state.aniRef.current = null
        Reflect.deleteProperty(mm, key)
      }
    }
  })

  const aniRef = useRef<Animation>(null)

  const getState = useMemoizedFn(() => {
    return { shouldMount, floatDomRef, setShouldMount, aniRef }
  })

  const _setIsOpen = (bool: boolean) => {
    setIsOpen(bool)

    if (bool) {
      mm[name] = { nextTick: nextTickOpen, getState }
    } else {
      mm[name] = { nextTick: nextTickClose, getState }

      prevClosedName = name
    }
  }

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: isOpen,
    onOpenChange: _setIsOpen,
    placement: 'bottom-start',
    transform: false
  })

  const floatDomRef = useRef<HTMLDivElement>(null)
  const [shouldMount, setShouldMount] = useState(isOpen)

  if (isOpen && isOpen !== shouldMount) {
    setShouldMount(true)
  }

  const endDomRectRef = useRef<DOMRect>(null)

  useLayoutEffect(() => {
    if (shouldMount && isPositioned) {
      endDomRectRef.current = floatDomRef.current.getBoundingClientRect()
    }
  }, [shouldMount, isPositioned])

  useLayoutEffect(() => {
    if (!floatDomRef.current) {
      return
    }

    // 等 useFloating 把位置计算完
    requestAnimationFrame(() => {
      mm[name].nextTick()
    })
  }, [isOpen])

  const click = useClick(context, { enabled: false, event: 'click' })
  const hover = useHover(context)
  const dismiss = useDismiss(context, { outsidePress: true, outsidePressEvent: 'click' })
  const { getReferenceProps, getFloatingProps } = useInteractions([click, hover, dismiss])

  const referenceProps = getReferenceProps()
  const childElement = cloneElement(children as any, { ref: mergeRefs([refs.setReference]), ...referenceProps })

  return (
    <>
      {childElement}

      {shouldMount && (
        <Portal>
          <div
            data-name={name}
            ref={mergeRefs([refs.setFloating, floatDomRef])}
            {...getFloatingProps()}
            className="shadow-xl whitespace-nowrap overflow-hidden"
            style={{ ...floatingStyles, borderRadius: 8 }}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  )
}
