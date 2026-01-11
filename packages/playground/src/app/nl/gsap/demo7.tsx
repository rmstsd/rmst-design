import { useGSAP } from '@gsap/react'
import clsx from 'clsx'
import gsap from 'gsap'
import Image from 'next/image'
import { useRef, useState } from 'react'

export default function Demo7(props) {
  const containerRef = useRef(null)

  const [count, setCount] = useState(20)

  useGSAP(
    () => {
      let panelsContainer = document.querySelector('#panels-container') as HTMLDivElement

      const panels = gsap.utils.toArray('#panels-container .panel') as HTMLDivElement[]

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: '#panels-container',
          pin: true,
          start: 'top top',
          scrub: true,
          markers: true,

          end: () => '+=' + (panelsContainer.offsetWidth - innerWidth)
        }
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="demo6 flow-root text-6xl">
      <section id="panels">
        <div id="panels-container" style={{ width: '500%' }}>
          <article id="panel-1" className="panel full-screen green bg-pink-100">
            <div className="d6-container">
              <div className="row">
                <div className="col-6"></div>
                <div className="col-6 d-flex flex-column">
                  <h2 className="panel__number">1</h2>
                </div>
              </div>
            </div>
          </article>
          <article id="panel-2" className="panel full-screen bg-slate-200">
            <div className="d6-container">
              <div className="row">
                <div className="col-6"></div>
                <div className="col-6 d-flex flex-column">
                  <h2 className="panel__number">2</h2>
                </div>
              </div>
            </div>
          </article>
          <article id="panel-3" className="panel full-screen purple bg-blue-200">
            <div className="d6-container">
              <div className="row">
                <div className="col-6"></div>
                <div className="col-6 d-flex flex-column">
                  <h2 className="panel__number">3</h2>
                </div>
              </div>
            </div>
          </article>
          <article id="panel-4" className="panel full-screen bg-red-200">
            <div className="d6-container">
              <div className="row">
                <div className="col-6"></div>
                <div className="col-6 d-flex flex-column">
                  <h2 className="panel__number">4</h2>
                </div>
              </div>
            </div>
          </article>
          <article id="panel-5" className="panel full-screen orange bg-green-200">
            <div className="d6-container">
              <div className="row">
                <div className="col-6 d-flex flex-column">
                  <h2 className="panel__number">5</h2>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="panel-6" className="panel cc">
        <h2 className="panel__number">6</h2>
      </section>
    </div>
  )
}
