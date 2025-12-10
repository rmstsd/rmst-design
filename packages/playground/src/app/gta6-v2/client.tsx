'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { Button } from 'rmst-design'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(useGSAP)

export default function Client() {
  const container = useRef(null)

  const { contextSafe } = useGSAP({ scope: container })

  const onClickGood = contextSafe(() => {
    gsap.to('.box', {
      x: 200,
      backgroundColor: 'green',
      rotation: 45,
      repeat: 2,
      yoyo: true
    })
  })

  return (
    <div ref={container} className="Gta6-V2">
      <div className="mb-2">
        <Button onClick={onClickGood}>Click me</Button>
      </div>

      <div className="box aspect-square w-24 bg-pink-500"></div>
    </div>
  )
}
