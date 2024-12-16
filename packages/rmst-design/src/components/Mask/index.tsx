import { useLayoutEffect, useRef, useState } from 'react'
import './style.less'

interface MaskProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClick?: () => void
}

export function Mask(props: MaskProps) {
  const { open, className, onClick, ...rest } = props

  const maskRef = useRef<HTMLDivElement>(null)

  const [inner, setInner] = useState(open)

  useLayoutEffect(() => {
    // setInner(true)
    if (open) {
      setInner(true)
      maskRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 200,
        easing: 'linear',
        fill: 'forwards'
      })
    }
  }, [open])

  const finalOpen = open && inner

  console.log(finalOpen)

  return <div className="mask" ref={maskRef} onClick={onClick} {...rest}></div>
}
