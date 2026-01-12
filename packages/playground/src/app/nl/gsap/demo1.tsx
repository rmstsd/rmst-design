'use client'

import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

export default function Demo1(props) {
  const containerRef = useRef(null)

  const { contextSafe } = useGSAP({ scope: containerRef })

  useGSAP(
    () => {
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.box_1',
          start: 'bottom bottom',
          end: 'bottom top',
          pin: true,
          // pinSpacing: false,
          scrub: true,
          toggleActions: 'restart pause resume reset',
          onEnter: () => {
            console.log('onEnter')
          },
          onLeave: () => {
            console.log('onLeave')
          },
          onEnterBack: () => {
            console.log('onEnterBack')
          },
          onLeaveBack: () => {
            console.log('onLeaveBack')
          },
          markers: true
        }
      })

      // tl.to('.box_1', { x: 100, duration: 2, repeat: 2, yoyo: true })
      // tl.to('.box_2', { x: 100, duration: 1 }, '<')
      // tl.to('.box_3', { x: 300, duration: 3 })
      // tl.to('.box_4', { x: 100, duration: 4 })
      // tl.to('.box_5', { x: 300, duration: 2 })
      // tl.to('.box_6', { x: 100, duration: 1 })
      // tl.to('.box_7', { x: 100, duration: 1 })

      // tl.then(() => {
      //   tl.progress(0.4).pause()
      // })

      tl.to('.box_1', {
        rotate: 360,
        x: 500
      })
        .to('.box_1', {
          backgroundColor: 'red'
        })
        .to('.box_1', {
          borderRadius: '50%'
        })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef}>
      <div style={{ height: 1200 }}></div>

      <div className="box box_0 h-20 bg-slate-300 w-[100px] mb-6">A</div>

      <div className="box box_1 h-20 bg-slate-300 w-[100px] text-center content-center text-4xl">A</div>

      <div className="box box_2 h-10 bg-slate-400 w-[100px] mt-6"></div>
      <div className="box box_3 h-10 bg-slate-400 w-[100px] mt-1"></div>
      <div className="box box_4 h-10 bg-slate-400 w-[100px] mt-1"></div>
      <div className="box box_5 h-10 bg-slate-400 w-[100px] mt-1"></div>
      <div className="box box_6 h-10 bg-slate-400 w-[100px] mt-1"></div>
      <div className="box box_7 h-10 bg-slate-400 w-[100px] mt-1"></div>

      <div style={{ height: 800 }}></div>
    </div>
  )
}
