import React, { isValidElement, ReactNode, useRef, useState } from 'react'
import { mergeRefs } from 'react-merge-refs'

import './style.less'
import { mergeProps, useAnTransition, useEventCallback, useMergeValue } from '../_util/hooks'
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
  useInteractions
} from '@floating-ui/react'

type TriggerProps = {
  popup?: ReactNode
  children?: ReactNode
  autoAlignPopupWidth?: boolean
  visible?: boolean
  onChange?: (visible: boolean) => void
  trigger?: 'click' | 'focus'
  disabled?: boolean
}

const defaultProps: TriggerProps = {
  autoAlignPopupWidth: false,
  trigger: 'click',
  disabled: false
}

export function Trigger(props: TriggerProps) {
  props = mergeProps(defaultProps, props)

  const { visible, onChange, popup, children, autoAlignPopupWidth, trigger, disabled } = props

  // const [popupVisible, setPopupVisible] = useMergeValue(false, { propsValue: visible })
  const [popupVisible, setPopupVisible] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: popupVisible,
    onOpenChange: setPopupVisible,
    whileElementsMounted: autoUpdate,
    transform: false,
    middleware: [
      offset(4),
      flip({ padding: 10 }),
      size({
        apply: ({ rects, elements, availableHeight }) => {
          Object.assign(elements.floating.style, { maxHeight: `${availableHeight}px`, minWidth: `${rects.reference.width}px` })
        },
        padding: 10
      })
    ]
  })

  const click = useClick(context, { event: 'click' })
  const dismiss = useDismiss(context, { referencePress: true, referencePressEvent: 'click', outsidePressEvent: 'click' })
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, click])

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
    open: popupVisible,
    keyframes: [
      { opacity: 0, transformOrigin: '0 0', transform: 'scaleY(0.9) translateZ(0)' },
      { opacity: 1, transformOrigin: '0 0', transform: 'scaleY(1) translateZ(0)' }
    ]
  })

  function triggerPropsChange(newValue: boolean) {
    if (newValue !== popupVisible) {
      onChange?.(newValue)
    }
  }

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
