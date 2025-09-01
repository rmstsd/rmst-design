import { useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react'
import { cloneElement, PropsWithChildren, ReactNode, use, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { Portal } from 'rmst-design'
import { TtMapValue, TooltipContext } from './TooltipContext'
import { useAnTransition } from '../../../../../rmst-design/src/components/_util/hooks'
import { cloneDeep } from 'es-toolkit'

const openKfs = [
  { transform: 'translateY(100px)', opacity: 0 },
  { transform: 'translateY(0)', opacity: 1 }
]

interface Props extends PropsWithChildren {
  name?: string
  content?: ReactNode
}

const toPx = (value: number) => {
  return `${value}px`
}

let active

const setActive = value => {
  active = value
  window.active = value
}

const eleDom = {}

export default function Tooltip(props: Props) {
  const { name, children, content } = props

  const [isOpen, setIsOpen] = useState(false)
  const [hasAni, setHasAni] = useState(true)

  const activeCoordRef = useRef<DOMRect>(null)
  const activeRef = useRef(null)

  const _setIsOpen = (bool: boolean) => {
    setHasAni(true)
    setIsOpen(bool)
    activeCoordRef.current = null

    if (bool) {
      // 当 B 打开的时候, 关闭上一个
      if (active && active !== activeRef.current) {
        let acDomRect = active.getFloatDom().getBoundingClientRect() as DOMRect

        active.close()
        activeCoordRef.current = acDomRect.toJSON()
      }

      // active 赋值成 B
      const newActive = {
        close: () => {
          setIsOpen(false)
        },
        getFloatDom: () => {
          return floatDomRef.current
        },
        from: '',
        to: name
      }

      newActive.from = active?.to
      newActive.to = name

      setActive(newActive)
      activeRef.current = newActive
    } else {
      active = null
    }
  }

  const { shouldMount, setDomRef } = useAnTransition({
    open: isOpen,
    keyframes:
      active?.from && active?.to
        ? dom => {
            console.log(name)
            console.log(eleDom[active.from], eleDom[active.to])
            const fromRect = eleDom[active.from].getBoundingClientRect().toJSON()
            const toRect = eleDom[active.to].getBoundingClientRect().toJSON()
            console.log(fromRect, toRect)

            console.log('--')

            if (name === 'A') {
              return [
                { left: toPx(fromRect.left), opacity: 0 },
                { left: toPx(toRect.left), opacity: 1 }
              ]
            }

            return [
              {
                left: toPx(fromRect.left),
                top: toPx(fromRect.top),
                width: toPx(fromRect.width),
                height: toPx(fromRect.height),
                opacity: 0
              },
              {
                left: toPx(toRect.left),
                top: toPx(toRect.top),
                width: toPx(toRect.width),
                height: toPx(toRect.height),
                opacity: 1
              }
            ]
          }
        : openKfs
  })

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: _setIsOpen,
    placement: 'bottom-start',
    transform: false
  })

  const floatDomRef = useRef<HTMLDivElement>(null)

  const click = useClick(context, { event: 'click' })
  const dismiss = useDismiss(context, { outsidePress: false, outsidePressEvent: 'click' })
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  const referenceProps = getReferenceProps()
  const childElement = cloneElement(children as any, { ref: mergeRefs([refs.setReference]), ...referenceProps })

  return (
    <>
      {childElement}

      {shouldMount && (
        <Portal>
          <div
            data-name={name}
            ref={mergeRefs([
              refs.setFloating,
              setDomRef,
              floatDomRef,
              el => {
                eleDom[name] = el
              }
            ])}
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
