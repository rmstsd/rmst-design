'use client'

import { useState } from 'react'
import { Button } from 'rmst-design'

// vue 官网动画怎么实现的 https://cn.vuejs.org/guide/built-ins/transition-group.html#move-transitions
export default function Home() {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <Button onClick={() => setVisible(!visible)}>Toggle</Button>

      {visible && (
        <div
          className=" bg-red-100 transition-all h-11"
          ref={el => {
            if (el) {
              let height = el.clientHeight
              el.style.height = 0
              el.style.overflow = 'hidden'

              el.style.transform = 'scale(0.5)'

              setTimeout(() => {
                el.style.height = `${height}px`
                el.style.transform = 'scale(1)'
              }, 16)
            }
          }}
        >
          Input
        </div>
      )}

      <div className="p-3 bg-pink-100">Select</div>
      <div className="p-3 bg-orange-100">DatePicker</div>
    </div>
  )
}
