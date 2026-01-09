'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(useGSAP)

export default function Page(props) {
  const containerRef = useRef(null)

  const { contextSafe } = useGSAP({ scope: containerRef })

  useGSAP(
    () => {
      gsap.to('.box', {
        x: 100,
        duration: 2
        // scrollTrigger: {
        //   trigger: '.box',
        //   start: 'top 80%', // 元素顶部到达视口80%处（快到底部）开始
        //   end: 'bottom 20%', // 元素顶部到达视口20%处（快到顶部）结束
        //   markers: true, // 开启调试线
        //   // 格式: onEnter onLeave onEnterBack onLeaveBack
        //   toggleActions: 'play pause resume reset'
        // }
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef}>
      <div style={{ height: 1000 }}></div>
      <div className="box h-10 bg-slate-400 w-[100px]"></div>
      <div style={{ height: 800 }}></div>
    </div>
  )
}
