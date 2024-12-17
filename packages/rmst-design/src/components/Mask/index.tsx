import React, { useLayoutEffect, useRef, useState } from 'react'
import './style.less'
import { createPortal } from 'react-dom'
import { usePrevious } from '../_util/hooks'
import { Portal } from '../Portal'

interface MaskProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
}

export function Mask(props: MaskProps) {
  const { open, className, ...rest } = props

  const { shouldMount, domRef } = useAnTransition({ open })

  return shouldMount ? (
    <Portal>
      <div {...rest} className="mask" ref={domRef}></div>
    </Portal>
  ) : null
}

const useAnTransition = ({ open }) => {
  const prevOpen = usePrevious(open)
  const domRef = useRef<HTMLDivElement>(null)
  const [shouldMount, setShouldMount] = useState(open)

  if (open && open !== shouldMount) {
    setShouldMount(open)
  }

  useLayoutEffect(() => {
    if ((prevOpen === undefined || !prevOpen) && open) {
      // 初始化就是开 或者 由关到开
      show()
    } else if (prevOpen && !open) {
      // 由开到关
      close().onfinish = () => {
        setShouldMount(false)
      }
    }
  }, [open, prevOpen])

  const show = () => {
    return domRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 200,
      easing: 'linear',
      fill: 'forwards'
    })
  }

  const close = () => {
    return domRef.current.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 200,
      easing: 'linear',
      fill: 'forwards'
    })
  }

  return {
    shouldMount,
    domRef
  }
}
