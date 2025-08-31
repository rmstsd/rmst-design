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

export default function Tooltip(props: Props) {
  const { name, children, content } = props

  const [isOpen, setIsOpen] = useState(false)

  const activeCoordRef = useRef<{ left: number; top: number }>(null)
  const activeRef = useRef(null)

  const _setIsOpen = (val: boolean) => {
    if (val) {
      if (active) {
        active.close()
        let acDomRect = active.getFloatDom().getBoundingClientRect() as DOMRect

        activeCoordRef.current = { left: acDomRect.left, top: acDomRect.top }
      }

      active = {
        close: () => {
          _setIsOpen(false)
        },
        getFloatDom: () => {
          return floatDomRef.current
        }
      }
      activeRef.current = active
    }

    setIsOpen(val)
  }

  const { shouldMount, setDomRef } = useAnTransition({
    open: isOpen,
    keyframes: activeCoordRef.current
      ? dom => {
          const domRect = dom.getBoundingClientRect()

          return [
            { left: toPx(activeCoordRef.current.left), top: toPx(activeCoordRef.current.top) },
            { left: toPx(domRect.left), top: toPx(domRect.top) }
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
            ref={mergeRefs([refs.setFloating, setDomRef, floatDomRef])}
            {...getFloatingProps()}
            className="shadow-xl"
            style={{ ...floatingStyles, borderRadius: 8 }}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  )
}
