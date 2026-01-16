import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import gsap from 'gsap'
import { GSDevTools } from 'gsap/GSDevTools'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'

export default function Demo9(props) {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      const tl = gsap.timeline()

      tl.to('.a-rect', {
        duration: 1,
        y: -40,
        ease: 'power1.inOut',
        stagger: {
          grid: [1, 7],
          from: 'edges',
          axis: 'x',
          amount: 1
        }
      })

      GSDevTools.create({ animation: tl })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="demo9 flow-root text-6xl">
      <div className="s-plc bg-slate-100"></div>
      <div className="cc leading-11" style={{ height: 400 }}>
        Able to work
        <br></br>
        with hundreds of tools
        <br></br>
        Devin connects to your favorite MCP servers, from Asana to Zapier
      </div>

      <div className="flex gap-4 justify-center">
        <div className="a-rect w-[200px] h-[300px] bg-slate-200"></div>
        <div className="a-rect w-[200px] h-[300px] bg-slate-200"></div>
        <div className="a-rect w-[200px] h-[300px] bg-slate-200"></div>
        <div className="a-rect w-[200px] h-[300px] bg-slate-200"></div>
        <div className="a-rect w-[200px] h-[300px] bg-slate-200"></div>
        <div className="a-rect w-[200px] h-[300px] bg-slate-200"></div>
        <div className="a-rect w-[200px] h-[300px] bg-slate-200"></div>
      </div>

      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
    </div>
  )
}
