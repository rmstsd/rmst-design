import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Demo2(props) {
  const containerRef = useRef(null)

  const { contextSafe } = useGSAP({ scope: containerRef })

  useGSAP(
    () => {
      const slides = gsap.utils.toArray('.slide') as HTMLDivElement[]
      // Pause between slides
      const delay = 1
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.wrapper',
          start: 'top 20px',
          end: `${'+=' + (slides.length - 1) * 50 + '%'} 200px`,
          pin: true,
          scrub: true,
          id: 'demo2',
          markers: true
        }
      })

      gsap.set(slides, {
        zIndex: i => slides.length - i
      })

      slides.forEach((slide, i) => {
        const nextSlide = slides[i + 1]
        if (!nextSlide) return

        tl.to(slide, { yPercent: -100 }, '+=' + delay)
        tl.to(nextSlide, { yPercent: 0 }, '<')
      })

      // Keep final slide on the screen
      tl.to({}, { duration: delay })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="g-container demo2">
      <div className="spacer"></div>
      <div className="wrapper flex justify-center items-center">
        <div className="slider">
          <div className="slide cc bg-amber-100">Slide 1</div>
          <div className="slide cc bg-red-100">Slide 2</div>
          <div className="slide cc bg-pink-200">Slide 3</div>
          <div className="slide cc bg-orange-200">Slide 4</div>
          <div className="slide cc bg-blue-200">Slide 5</div>
          <div className="slide cc bg-red-200">Slide 6</div>
        </div>
      </div>
      <div className="spacer"></div>
    </div>
  )
}
