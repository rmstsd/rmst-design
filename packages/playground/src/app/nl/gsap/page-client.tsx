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
import Demo8 from './demo8'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Demo0 from './demo0'

import { cn } from '@/utils/cn'

const demoList = [Demo0, Demo1, Demo2, Demo3, Demo4, Demo5, Demo6, Demo7, Demo8]

export default function PageClient(props) {
  const query = useSearchParams()
  const router = useRouter()

  const demoName = query.get('demo')

  return (
    <div className="gasp-page">
      <div className="sticky z-50 top-0 w-max">
        {demoList.map((demo, index) => (
          <div
            className={cn('demo-item cursor-pointer px-2 py-1 bg-slate-200 hover:bg-slate-300', {
              'bg-slate-300': demo.name === demoName
            })}
            key={index}
            onClick={() => router.replace('/nl/gsap?demo=' + demo.name)}
          >
            {demo.name}
          </div>
        ))}
      </div>

      <div>{demoName && demoList.map((Demo, index) => (Demo.name === demoName ? <Demo key={index} /> : null))}</div>
    </div>
  )
}
