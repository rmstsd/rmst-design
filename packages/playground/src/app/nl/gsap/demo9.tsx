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
      {
        const tl = gsap.timeline({
          defaults: { duration: 1 },
          scrollTrigger: {
            trigger: '.f-p',
            pin: true,
            pinSpacing: false,
            start: 'top top',
            endTrigger: '.end-trigger-1',
            end: 'top bottom-=100px',
            markers: true,
            scrub: true
          }
        })
        tl.pause()
        // GSDevTools.create({ animation: tl })

        tl.to('.f-p', { opacity: 0, filter: 'blur(10px)' })

        tl.to(['.col-item.index-0', '.col-item.index-6'], { y: -300 }, '<')
        tl.to(['.col-item.index-1', '.col-item.index-5'], { y: -200 }, '<')
        tl.to(['.col-item.index-2', '.col-item.index-4'], { y: -100 }, '<')

        tl.to('.col-item.index-3', { y: 100 }, '<')

        gsap.set('.b-rect', {
          width: () => document.querySelector('.nh').clientWidth,
          height: () => document.querySelector('.nh').clientHeight
        })
      }

      {
        const tl = gsap.timeline({
          defaults: { duration: 1 },
          scrollTrigger: {
            trigger: '.end-trigger-1',
            pin: true,
            pinSpacing: false,
            start: 'top bottom-=100px',
            endTrigger: '.end-trigger-2',
            end: 'top bottom-=100px',
            id: 'end_2',
            markers: {
              indent: 120
            },
            scrub: true
          }
        })

        tl.set('.b-rect', {
          y: (index, target) => {
            const nhs = document.querySelectorAll('.nh')
            const nh = nhs[index]
            let value = -(target.getBoundingClientRect().top - nh.getBoundingClientRect().top)
            return value
          }
        })
        tl.fromTo('.nh', { visibility: 'visible' }, { visibility: 'hidden' })
        tl.to('.b-rect', { y: 0 }, '<')
        tl.to('.b-rect.index-1', { width: 500 })
      }
    },
    { scope: containerRef }
  )

  const grads = 100

  const list = [
    {
      style: {},
      children: [{ className: 'rectangle' }, {}, { className: 'rectangle' }]
    },
    {
      style: { marginTop: grads },
      children: [{ className: 'rectangle' }, {}, { className: 'rectangle' }]
    },
    {
      style: { marginTop: grads * 3 },
      children: [{}, { className: 'nh rectangle' }]
    },
    {
      style: { marginTop: grads * 1.4 },
      children: [{}, { className: 'nh rectangle' }]
    },
    {
      style: { marginTop: grads * 3 },
      children: [{}, { className: 'nh rectangle' }]
    },
    {
      style: { marginTop: grads },
      children: [{ className: 'rectangle' }, {}, { className: 'rectangle' }]
    },
    {
      style: {},
      children: [{ className: 'rectangle' }, {}, { className: 'rectangle' }]
    }
  ]

  return (
    <div ref={containerRef} className="demo9 flow-root text-6xl">
      <div className="s-plc bg-slate-100"></div>
      <div className="f-p cc" style={{ height: 400, fontSize: 55 }}>
        <div>Able to work</div>
        <div className="o-text-gradient mt-2">with hundreds of tools</div>
        <div className="mt-8" style={{ fontSize: 23 }}>
          Devin connects to your favorite MCP servers, from Asana to Zapier
        </div>
      </div>

      <div className="flex gap-4" style={{ marginTop: 180 }}>
        {list.map((item, index) => (
          <div className={clsx('col-item', `index-${index}`)} key={index} style={{ ...item.style }}>
            {item.children.map((child, index) => (
              <div className={clsx('a-rect card-item', child.className)} key={index}></div>
            ))}
          </div>
        ))}
      </div>

      <div className="end-trigger-1 bg-red-400 h-1"></div>

      <div className="flex gap-4 justify-center mt-2">
        <div className="b-rect bt-cards-item cc">1</div>
        <div className="b-rect index-1 bt-cards-item cc">2</div>
        <div className="b-rect bt-cards-item cc">3</div>
      </div>

      <div className="end-trigger-2 bg-blue-400 h-1"></div>

      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
      <div className="s-plc"></div>
    </div>
  )
}
