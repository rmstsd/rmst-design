import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import { useRef, useState } from 'react'

export default function Demo4(props) {
  const containerRef = useRef(null)

  const [count, setCount] = useState(5)

  const list = Array.from({ length: count }, (_, index) => index)
  const bgColors = [' bg-amber-100', ' bg-red-100', ' bg-green-100', ' bg-blue-100', ' bg-purple-100']

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.acc-wrapper',
          scrub: true,
          pin: true,
          start: 'top 100px',
          end: 'bottom 300px',
          pinSpacing: false,
          markers: true
        }
      })

      tl.to('.accordion .acc-content', { height: 0, opacity: 0 })
      tl.to('.accordion', { marginBottom: -4 }, '<')
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="demo4 flow-root">
      <div className="s-plc"></div>
      <div className="s-plc"></div>

      <div className="acc-wrapper px-6">
        {list.map((item, index) => (
          <div key={item} className={`accordion item ${bgColors[index]} cc mb-4 rounded-full`}>
            <div className="title h-20 cc ">title {item}</div>

            <div className="cc acc-content" style={{ height: 60 }}>
              content {item}
            </div>
          </div>
        ))}
      </div>

      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
    </div>
  )
}
