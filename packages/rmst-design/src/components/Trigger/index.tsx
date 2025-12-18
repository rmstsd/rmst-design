import React, { isValidElement, ReactNode } from 'react'
import { mergeRefs } from 'react-merge-refs'
import { mergeProps, useAnTransition, useControllableValue } from '../_util/hooks'
import { Portal } from '../Portal'
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions
} from '@floating-ui/react'

import './style.less'

type TriggerProps = {
  popup?: ReactNode
  children?: ReactNode
  autoAlignPopupWidth?: boolean
  value?: boolean
  onChange?: (visible: boolean) => void
  trigger?: 'click' | 'focus' | 'hover'
  disabled?: boolean

  onExited?: () => void
  _debugName?: string
}

const defaultProps: TriggerProps = {
  autoAlignPopupWidth: false,
  trigger: 'click',
  disabled: false
}

export function Trigger(props: TriggerProps) {
  props = mergeProps(defaultProps, props)

  const { value, popup, children, autoAlignPopupWidth, trigger, disabled, onExited, _debugName } = props

  const [popupVisible, setPopupVisible] = useControllableValue(props, { defaultValue: value })

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: popupVisible,
    onOpenChange: setPopupVisible,
    whileElementsMounted: autoUpdate,
    transform: false,
    middleware: [
      offset(6),
      flip({ padding: 10 }),
      size({
        apply: ({ rects, elements, availableHeight }) => {
          Object.assign(
            elements.floating.style,
            { maxHeight: `${availableHeight}px` },
            autoAlignPopupWidth && { minWidth: `${rects.reference.width}px` }
          )
        },
        padding: 10
      })
    ]
  })

  const click = useClick(context, { enabled: trigger === 'click', event: 'click' })
  const focus = useFocus(context, { enabled: trigger === 'focus' })
  const hover = useHover(context, { enabled: trigger === 'hover' })

  const dismiss = useDismiss(context, {
    referencePress: trigger !== 'focus',
    referencePressEvent: 'click',
    outsidePressEvent: 'pointerdown'
  })
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, click, focus, hover])

  const triggerElement = getTriggerElement(children)
  const triggerProps = triggerElement.props

  const referenceProps = getReferenceProps()
  const referencePropsMerged = Object.keys(referenceProps).reduce((acc, k) => {
    acc[k] = (...args) => {
      const referenceFn = referenceProps[k] as Function
      referenceFn(...args)

      triggerProps[k]?.(...args)
    }

    return acc
  }, {})

  const childElement = React.cloneElement(triggerElement, {
    ref: mergeRefs([triggerProps.ref, refs.setReference]),
    ...referencePropsMerged
  })

  const { shouldMount, setDomRef } = useAnTransition({
    appear: false,
    open: popupVisible,
    keyframes: [
      { opacity: 0, transformOrigin: '0 0', transform: 'scaleY(0.9) translateZ(0)' },
      { opacity: 1, transformOrigin: '0 0', transform: 'scaleY(1) translateZ(0)' }
    ],
    onExited
  })

  return (
    <>
      {childElement}

      {shouldMount && (
        <Portal>
          <div
            className="rmst-popup-content"
            ref={mergeRefs([setDomRef, refs.setFloating])}
            {...getFloatingProps()}
            style={floatingStyles}
          >
            {popup}
          </div>
        </Portal>
      )}
    </>
  )
}

const getTriggerElement = (children): any => {
  if (isValidElement(children)) {
    return children
  }

  return <span>{children}</span>
}
