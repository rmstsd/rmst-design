'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

import './demo.scss'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(useGSAP)

import Demo1 from './demo1'
import Demo2 from './demo2'
import { ClientOnly } from '@/components/ClientOnly'
import Demo3 from './demo3'
import Demo4 from './demo4'
import Demo5 from './demo5'
import Demo6 from './demo6'
import Demo7 from './demo7'

export default function Page(props) {
  return (
    <div className="gasp-page">
      <Demo1 />

      {/* <Demo2 /> */}

      {/* <Demo3 /> */}

      {/* <Demo4 /> */}

      {/* <Demo5 /> */}

      {/* <Demo6 /> */}

      {/* <Demo7 /> */}
    </div>
  )
}
