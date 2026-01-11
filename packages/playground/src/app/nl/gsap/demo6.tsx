import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import gsap from 'gsap'
import Image from 'next/image'
import { useRef, useState } from 'react'

export default function Demo6(props) {
  const containerRef = useRef(null)

  const [count, setCount] = useState(20)

  useGSAP(
    () => {
      const stickyEls = document.querySelectorAll('.sticky-statement')

      stickyEls.forEach((el, index) => {
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'bottom 70%',
            end: 'bottom center',
            markers: true,
            toggleActions: 'play none reverse none',
            scrub: true,
            id: index.toString()
          }
        })
        tl.to(el, { opacity: 0, yPercent: -10 })
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="demo6 flow-root text-6xl">
      <section>
        <div className="sticky-statement">
          <h1>Statement one</h1>
        </div>
        <div className="sticky-statement">
          <h1>Statement two</h1>
        </div>
        <div className="sticky-statement">
          <h1>Statement three</h1>
        </div>
      </section>
    </div>
  )
}
