'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { isClient } from 'rmst-design'
import outro from './assets/outro.webp'

import './page.scss'

import Image from 'next/image'

import './page.scss'
import { GSDevTools } from 'gsap/GSDevTools'
import S1 from './s1'

import Lenis from 'lenis'
import { CalHampton } from './figure/Cal_Hampton'
import { SunState } from './SunState'
import BoobieIke from './figure/Boobie_Ike'
import { S0 } from './s0'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(useGSAP)
gsap.registerPlugin(GSDevTools)

// initLenis()
function initLenis() {
  // Initialize a new Lenis instance for smooth scrolling
  const lenis = new Lenis()

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  lenis.on('scroll', ScrollTrigger.update)

  // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
  // This ensures Lenis's smooth scroll animation updates on each GSAP tick
  gsap.ticker.add(time => {
    lenis.raf(time * 1000) // Convert time from seconds to milliseconds
  })

  // Disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0)
}

export default function Client() {
  return (
    <div className="Gta6-V2">
      {/* <S0 /> */}
      <S1 />

      <Image src={outro} alt="" className=" w-full h-screen object-cover" />

      <div className="flex gap-20 justify-center items-center px-20" style={{ height: '50vh' }}>
        <div className="font-bold text-7xl" style={{ color: '#ffb0c4' }}>
          只在雷奥奈达遇得上
        </div>
        <div className="text-5xl" style={{ color: '#ffb99c' }}>
          当夕阳西下，霓虹灯亮起，每个人都有自己的抱负，也有要承受的代价。
        </div>
      </div>

      <CalHampton />

      <SunState />

      <BoobieIke />
    </div>
  )
}
