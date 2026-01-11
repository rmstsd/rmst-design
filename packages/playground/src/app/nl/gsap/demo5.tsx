import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import gsap from 'gsap'
import Image from 'next/image'
import { useRef, useState } from 'react'

export default function Demo5(props) {
  const containerRef = useRef(null)

  const [count, setCount] = useState(20)

  const list = Array.from({ length: count }, (_, index) => index)

  useGSAP(
    () => {
      gsap.from('.left', {
        scrollTrigger: {
          trigger: '.left',
          start: 'top center',
          endTrigger: '.last-item',
          end: 'top center',
          pin: true,
          markers: true
        }
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="demo5 flow-root text-6xl">
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>

      <div className="d5-c  flex items-start">
        <div className="left">哈哈哈</div>

        <div className="right grow">
          {list.map((item, index) => (
            <div key={index} className={clsx(`right-${index} border p-2`, index === list.length - 1 && 'last-item')}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
    </div>
  )
}
