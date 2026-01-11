import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import { useRef } from 'react'

import lyy from '@/assets/lyy.jpg'

export default function Demo3(props) {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      setupAnimations()

      function setupAnimations() {
        gsap.from('.keyhole', {
          'clip-path': 'polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)',
          scrollTrigger: {
            trigger: '.section--primary',
            start: 'top 50',
            end: 'bottom 90%',
            endTrigger: '.section--2',
            scrub: true
            // markers: true
          }
        })

        gsap.to('.arrow', {
          opacity: 0,
          scrollTrigger: {
            trigger: '.section--primary',
            start: 'top 20px',
            end: '+=200 100px',
            scrub: true,
            id: 'arrow',
            markers: true
          }
        })
      }
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="demo3 bg-amber-50">
      <span className="keyhole"></span>
      <span className="arrow" aria-hidden="true">
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-5 -5 30 30">
          <path d="M 0 10 H 20 L 10 0 M 20 10 L 10 20" strokeWidth="4" strokeLinecap="square" strokeLinejoin="round"></path>
        </svg>
      </span>

      <div className="" style={{ height: 100 }}></div>
      <div className="section--primary p-10  text-2xl">
        <Image src={lyy} alt="lyy"></Image>
        At vero eos et accusamus. Cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia. Corrupti quos
        dolores et quas molestias excepturi sint occaecati. Ut aut reiciendis voluptatibus maiores alias consequatur aut
        perferendis doloribus asperiores repellat. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
        laboriosam. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam. Et iusto odio
        dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.
      </div>

      <div className="section--2 cc h-screen bg-red-200">section--2</div>
      <div className="section--3 cc h-screen bg-pink-100">section--3</div>
    </div>
  )
}
