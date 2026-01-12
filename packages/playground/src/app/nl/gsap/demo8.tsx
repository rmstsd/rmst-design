import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'

export default function Demo8(props) {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      let tl = gsap.timeline({
        defaults: { duration: 1 },
        scrollTrigger: {
          trigger: '.plg',
          start: 'bottom bottom-=100px',
          end: 'bottom 100px',
          scrub: true,
          pin: true,
          toggleActions: 'restart none none reset',
          markers: true
        }
      })

      tl.fromTo('.plg', { backgroundColor: 'red' }, { backgroundColor: 'green' })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="demo8 flow-root text-6xl">
      <div className=" cc" style={{ height: 'calc(100vh + 200px)' }}>
        哈哈
      </div>

      <div className="plg h-screen ">h-screen</div>

      <div className="h-screen cc">哈哈 1</div>
      <div className="h-screen cc">哈哈 2</div>
    </div>
  )
}
