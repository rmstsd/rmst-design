import { useClick, useDismiss, useFloating, useInteractions, useMergeRefs } from '@floating-ui/react'
import { Activity, useEffect, useEffectEvent, useId, useLayoutEffect, useRef, useState, version } from 'react'
import { Button, Portal } from 'rmst-design'
import Tooltip from './Tooltip/Tooltip'

import './style.less'
import { createPortal } from 'react-dom'

const useMyFloating = (isOpen, setIsOpen) => {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    transform: false
  })

  const click = useClick(context, { event: 'click' })
  const dismiss = useDismiss(context, { outsidePressEvent: 'click' })
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  return { refs, floatingStyles, getReferenceProps, getFloatingProps }
}

export default function AHome() {
  return (
    <div>
      <AHomePage />
    </div>
  )
}

const toPx = (value: number) => {
  return `${value}px`
}

function AHomePage() {
  const [show, setShow] = useState(true)
  const [parentCount, setParentCount] = useState(0)

  console.log('version', version)

  return (
    <div>
      <Button onClick={() => setShow(!show)}>{String(show)}</Button>
      <Button onClick={() => setParentCount(parentCount + 1)}>{parentCount}</Button>

      <hr />

      <Activity mode={show ? 'visible' : 'hidden'}>
        <Child parentCount={parentCount} />
      </Activity>
    </div>
  )
}

const Child = ({ parentCount }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('child mounted')

    return () => {
      console.log('child unmounted')
    }
  }, [])

  return (
    <>
      <Button onClick={() => setCount(count + 1)}>{count}</Button>
      <span style={{ display: 'grid' }}>count: {count}</span>

      <span>parentCount: {parentCount}</span>
      <input type="text" />
    </>
  )
}
