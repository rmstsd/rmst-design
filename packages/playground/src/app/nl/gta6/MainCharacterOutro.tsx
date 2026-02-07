import { useGSAP } from '@gsap/react'
import outro from './assets/outro.webp'

import Image from 'next/image'
import gsap from 'gsap'

export default function MainCharacterOutro(props) {
  useGSAP(() => {
    {
      const tl = gsap.timeline({
        defaults: { duration: 2 },
        scrollTrigger: {
          trigger: '.outro-container',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          markers: true
        }
      })
      // tl.pause()
      // GSDevTools.create({ animation: tl })
      tl.fromTo(
        '.outro-container',
        { clipPath: `polygon(0% 0%, 100% 0%, 100% calc(100% - 6vw), 0% 100%)` },
        { clipPath: `polygon(0% 0%, 100% 0%, 100% calc(100% + 0vw), 0% 100%)` }
      )
      tl.fromTo('.outro-image', { y: -88 }, { y: 88 }, '<')
    }
  })

  return (
    <div className="outro-container bg-gray-900">
      <Image src={outro} alt="" className="outro-image w-full h-screen object-cover" />
    </div>
  )
}
