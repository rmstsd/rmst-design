import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

export default function Demo1() {
  const container = useRef(null)

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      const pinnedPanels = gsap.utils.toArray('.panel.pinned') as HTMLElement[]

      gsap.set(pinnedPanels[0], { autoAlpha: 1 })

      pinnedPanels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          endTrigger: '.end-pin',
          end: 'top top',
          pin: true,
          pinSpacing: false,
          onEnter: () => gsap.to(panel, { autoAlpha: 1, duration: 0.35 }),
          onLeaveBack: () => i && gsap.to(panel, { autoAlpha: 0 }),
          markers: {
            indent: 150 * i,
            startColor: 'white',
            endColor: 'white'
          }
          // id: (i + 1).toString()
        })
      })
    },
    { scope: container }
  )
  return (
    <div ref={container}>
      <div className="description panel hr-bottom">
        <div>
          <h1>Layered pinning</h1>
          <p>Use pinning to layer panels on top of each other as you scroll.</p>
          <div className="scroll-down">
            <div className="arrow"></div>
          </div>
        </div>
      </div>

      <section className="panel gray">
        <div className="text-center">
          <h2>Another normal section</h2>
          <p>after this the content is pinned</p>
        </div>
      </section>

      <section className="panel pink pinned" style={{ backgroundColor: 'orange' }}>
        <h2 className="panel__number">1</h2>
      </section>
      <section className="panel purple pinned" style={{ backgroundColor: 'purple' }}>
        <h2 className="panel__number">2</h2>
      </section>
      <section className="panel pink pinned" style={{ backgroundColor: 'violet' }}>
        <h2 className="panel__number">3</h2>
      </section>
      <section className="panel purple pinned" style={{ backgroundColor: 'cadetblue' }}>
        <h2 className="panel__number">4</h2>
      </section>

      <section className="panel end-pin ">
        <p>end-pin Normal Scrolling in this section</p>
      </section>
      <section className="panel description">
        <h1>The End!</h1>
      </section>
    </div>
  )
}
