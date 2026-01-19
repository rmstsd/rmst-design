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
      const nhDom = document.querySelector('.nh')

      {
        const tl = gsap.timeline({
          defaults: { duration: 1 },
          scrollTrigger: {
            trigger: '.f-p',
            pin: true,
            pinSpacing: false,
            start: 'top top',
            endTrigger: '.end-trigger-1',
            end: `top center-=${nhDom.clientHeight / 2}`,
            scrub: true,
            markers: true
          }
        })
        tl.pause()

        tl.to('.f-p', { opacity: 0, filter: 'blur(10px)' })

        tl.from(['.col-item.index-0 .a-rect', '.col-item.index-6 .a-rect'], { y: 300 }, '<')
        tl.from(['.col-item.index-1 .a-rect', '.col-item.index-5 .a-rect'], { y: 200 }, '<')
        tl.from(['.col-item.index-2 .a-rect', '.col-item.index-4 .a-rect'], { y: 100 }, '<')

        tl.from('.col-item.index-3 .a-rect', { y: 100 }, '<')
      }

      {
        return
        const tl = gsap.timeline({
          defaults: { duration: 1 },
          scrollTrigger: {
            trigger: '.three-big-container',
            pin: true,
            // pinSpacing: false,
            start: `top center-=${nhDom.clientHeight / 2}`,
            endTrigger: '.end-trigger-2',
            end: `top center-=${nhDom.clientHeight / 2}`,
            markers: true,
            scrub: true
          }
        })

        gsap.set('.b-rect', {
          width: () => {
            return nhDom.clientWidth
          },
          height: () => {
            const height = nhDom.clientHeight
            return height
          }
        })
        gsap.set('.b-rect', {
          y: (_, target) => {
            const index = target.getAttribute('data-index')
            const tt = document.querySelector(`.nh-w-${index}`)

            const nhRect = tt.getBoundingClientRect()
            let value = -(target.getBoundingClientRect().top - nhRect.top)
            return value
          }
        })
        tl.fromTo('.nh', { visibility: 'visible' }, { visibility: 'hidden' })
        tl.fromTo('.b-rect', { visibility: 'hidden' }, { visibility: 'visible' }, '<')
        tl.to('.b-rect', { y: 0 }, '<')
        tl.to('.b-rect[data-index="1"]', { width: 500 })
      }
    },
    { scope: containerRef }
  )

  const grads = 160

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
      style: { marginTop: grads * 2 },
      children: [{}, { wrapClassName: 'nh-w-0', className: 'nh index-0 rectangle' }]
    },
    {
      style: { marginTop: grads * 3 },
      children: [{}, { wrapClassName: 'nh-w-1', className: 'nh index-1 rectangle' }]
    },
    {
      style: { marginTop: grads * 2 },
      children: [{}, { wrapClassName: 'nh-w-2', className: 'nh index-2 rectangle' }]
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
    <div ref={containerRef} className="demo9 flow-root">
      <div className="s-plc bg-slate-100">Placeholder</div>
      <div className="f-p cc" style={{ height: 400, fontSize: 55 }}>
        <div>Able to work</div>
        <div className="o-text-gradient" style={{ lineHeight: '1' }}>
          with hundreds of tools
        </div>
        <div className="mt-8" style={{ fontSize: 23 }}>
          Devin connects to your favorite MCP servers, from Asana to Zapier
        </div>
      </div>

      <div className="flex gap-4" style={{ marginTop: 180 }}>
        {list.map((item, index) => (
          <div className={clsx('col-item', `index-${index}`)} key={index} style={{ ...item.style }}>
            {item.children.map((child, index) => (
              <div className={clsx('plc-rect', child.wrapClassName)} key={index}>
                <div className={clsx('a-rect card-item', child.className)}></div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="end-trigger-1 h-1"></div>

      <div className="three-big-container flex gap-4 justify-center mt-2 ">
        <div data-index="0" className="b-rect bt-cards-item cc">
          1
        </div>
        <div data-index="1" className="b-rect bt-cards-item cc">
          2
        </div>
        <div data-index="2" className="b-rect bt-cards-item cc">
          3
        </div>
      </div>

      <div className="end-trigger-2 h-1 bg-pink-400"></div>

      <div className="s-plc">Placeholder</div>
      <div className="s-plc">Placeholder</div>
      <div className="s-plc">Placeholder</div>
      <div className="s-plc">Placeholder</div>
      <div className="s-plc" style={{ height: 500 }}>
        Placeholder
      </div>
    </div>
  )
}
