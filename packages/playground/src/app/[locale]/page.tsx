'use client'

import { use, useLayoutEffect, useRef, useState } from 'react'
import { Button } from 'rmst-design'

export default function Home() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!visible) {
      return
    }

    const el = ref.current
    let height = el.clientHeight
    el.style.height = '0'
    el.style.transform = 'scale(0.2)'
    el.style.overflow = 'hidden'

    document.body.offsetHeight

    el.style.transition = 'height 1s, transform 0.5s'
    el.style.height = `${height}px`
    el.style.transform = 'scale(1)'
  }, [visible])

  return (
    <div>
      <Button onClick={() => setVisible(!visible)}>Toggle</Button>

      <div className="flex flex-col gap-2 p-2">
        {visible && (
          <div className=" bg-red-100 " style={{ height: 60 }} ref={ref}>
            Input
          </div>
        )}

        <div className="p-3 bg-pink-100">Select</div>
        <div className="p-3 bg-orange-100">DatePicker</div>
      </div>
    </div>
  )
}
