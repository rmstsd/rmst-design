'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { Button, isClient } from 'rmst-design'
import outro from './assets/outro.webp'

import './page.scss'

import Image from 'next/image'
import firstBanner from './assets/firstBanner.webp'
import logoHeadCorner from './assets/logoHeadCorner.webp'
import logoMaskSvg from './assets/logoMaskSvg.svg'
import gtaVi from './assets/gtaVi.png'

import videoImage_1 from './assets/videoImage_1.webp'
import videoImage_2 from './assets/videoImage_2.webp'
import videoImage_3 from './assets/videoImage_3.webp'

import Jason_Duval_01 from './assets/Jason_Duval_01.webp'
import Jason_Duval_02 from './assets/Jason_Duval_02.webp'
import Jason_Duval_06 from './assets/Jason_Duval_06.webp'

import Jason_Duval_05 from './assets/Jason_Duval_05.webp'
import Jason_Duval_03 from './assets/Jason_Duval_03.webp'
import Jason_Duval_04 from './assets/Jason_Duval_04.webp'

import ImageContainer from './components/ImageContainer/ImageContainer'

import './page.scss'
import { GSDevTools } from 'gsap/GSDevTools'
import S1 from './s1'

import Lenis from 'lenis'
import { CalHampton } from './figure/Cal_Hampton'
import { SunState } from './SunState'
import BoobieIke from './figure/Boobie_Ike'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(useGSAP)
gsap.registerPlugin(GSDevTools)

if (isClient) {
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
  const container = useRef(null)

  const { contextSafe } = useGSAP({ scope: container })

  useGSAP(
    () => {
      p_1()

      function p_1() {
        let tl = gsap.timeline({
          defaults: { duration: 2 }
          // scrollTrigger: {
          //   trigger: '.playground-1',
          //   start: 'bottom bottom',
          //   end: 'bottom top',
          //   pin: true,
          //   // pinSpacing: false,
          //   toggleActions: 'restart pause resume reset',
          //   scrub: true
          // }
        })

        // GSDevTools.create({ animation: tl })
        tl.to('.logo-head', { opacity: 0 }, '<')

        // 20vh
        gsap.set('.banner-container', { backgroundColor: 'white', maskPosition: 'center', maskSize: '3000vw' })
        // tl.to('.banner-container', { maskPosition: 'center center', maskSize: 'auto 140px' })

        tl.to('.banner-inner', { autoAlpha: 0 }, '<')

        gsap.set('.colourful-logo', {
          autoAlpha: 0,
          maskImage: 'radial-gradient(circle at 50% 200%, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 50%)'
        })
        tl.to('.colourful-logo', {
          autoAlpha: 1,
          maskImage: 'radial-gradient(circle at 50% 50%, rgb(0, 0, 0) 100%, rgba(0, 0, 0, 0) 100%)'
        })

        tl.to(['.fs-text-wrap', '.colourful-logo'], { scale: 0.8 }, '<')
        tl.to('.banner-container', { opacity: 0 }, '<')

        gsap.set('.fs-text', {
          opacity: 0,
          backgroundImage: `radial-gradient(circle at 50% 150vh, rgb(255, 210, 123) 0vh, rgb(223, 58, 147) 50vh, rgb(92, 22, 99) 90vh, rgba(32, 31, 66, 0) 100vh)`
        })
        tl.to(
          '.fs-text',
          {
            opacity: 1,
            backgroundImage: `radial-gradient(circle at 50% -30vh, rgb(255, 214, 135) 0px, rgb(252, 82, 67) 50vh, rgb(157, 47, 106) 90vh, rgba(32, 31, 66, 0) 150vh)`,
            duration: 2
          },
          '<'
        )

        gsap.set('.plg-1', {
          maskImage: 'radial-gradient(circle at 50% 18.7395vh, rgb(0, 0, 0) 100.696vh, rgba(0, 0, 0, 0) 113.565vh)'
        })
        tl.to('.plg-1', { maskImage: 'radial-gradient(circle at 50% -40vh, rgb(0, 0, 0) 0vh, rgba(0, 0, 0, 0) 50vh)' }, '-=1')

        tl.pause()
      }

      function p2() {
        let tl = gsap.timeline({
          defaults: { duration: 2 }
          // scrollTrigger: {
          //   trigger: '.playground-2',
          //   start: 'bottom bottom',
          //   end: 'bottom top',
          //   pin: true,
          //   toggleActions: 'restart pause resume reset',
          //   scrub: true,
          //   markers: true,
          //   id: 'p2'
          // }
        })

        gsap.set('.playground-2', { marginTop: '-100vh' })
        tl.fromTo('.mgzec', { opacity: 0 }, { opacity: 1 })
      }
    },
    { scope: container.current }
  )

  let p_1 = (
    <section className="playground-1 bg-gray-900 h-screen flow-root overflow-clip">
      <div className="plg-1 relative flow-root h-screen">
        {/* 第一屏 */}
        <div className="banner-container overflow-clip h-full" style={{ maskImage: `url(${logoMaskSvg.src})` }}>
          <div className="banner-inner h-full">
            <Image src={firstBanner} alt="" className="first-banner object-cover" />
            <Image src={logoHeadCorner} alt="" className="logo-head object-cover absolute top-0" />
          </div>
        </div>

        <div className="colourful-logo absolute inset-0 h-full">
          <Image src={gtaVi} alt="" className="mx-auto" style={{ height: 140, width: 'auto', marginTop: '20vh' }} />
        </div>

        {/* 第二屏 */}
        <main className="fs-text-wrap h-full flow-root absolute inset-0  ">
          <Image src={gtaVi} alt="" className="mx-auto invisible" style={{ height: 140, width: 'auto', marginTop: '20vh' }} />

          <div className="fs-text text-center font-bold bg-clip-text" style={{ fontSize: 88, lineHeight: 1.2 }}>
            2026年 <br /> 11月19日 <br /> 敬请期待
          </div>
        </main>
      </div>
    </section>
  )

  let p_2 = (
    <section className="playground-2 ze-text h-screen w-full bg-gray-900 flow-root" style={{ padding: '20vh' }}>
      <div
        className="mgzec bg-clip-text font-bold"
        style={{
          color: 'transparent',
          backgroundImage:
            'radial-gradient(circle at 42.792% 55.84vh, rgb(255, 188, 132) 0%, rgb(244, 75, 89) 54.644%, rgb(139, 40, 104) 80.456%, rgba(32, 31, 66, 0) 122.08%)'
        }}
      >
        <div style={{ fontSize: 77 }}>美国罪恶城</div>
        <div style={{ fontSize: 26 }}>
          杰森和露西娅心里一直清楚，命运对他们不公。本应简单的行动出了差错，美国阳光最灿烂的地方向两人展露出它最阴暗的一面，将他们卷入一场横跨雷奥奈达的犯罪阴谋。若想活着逃出生天，他们比以往任何时候都更需要彼此依靠。
        </div>
      </div>
    </section>
  )

  return (
    <div ref={container} className="Gta6-V2">
      {/* <Demo1 /> */}

      <Image src={logoMaskSvg} alt=""></Image>

      {/* 第一部分 */}
      {p_1}

      {/* 第二部分 */}
      {/* {p_2} */}

      {/* <main className="bg-gray-900 relative z-10">
        <Image src={videoImage_1} alt="" className="vi-1 w-full h-screen sticky top-0 object-cover" />

        <section className="vi-1-content flex gap-10 relative" style={{ padding: '10vh 15vw' }}>
          <div className="grow w-0 shrink-0">
            <div className="text-6xl font-bold" style={{ color: '#fff9cb' }}>
              杰森 · 杜瓦
            </div>
            <div className="text-4xl font-bold mt-10" style={{ color: '#ffb0c4' }}>
              杰森想过上轻松日子，可生活却越来越艰难。
            </div>
            <div className="text-2xl text-white mt-8">
              杰森从小就与骗子和小偷为伍。他曾短暂参军，希望洗去少年时期不堪的过往。退伍后，他在各个礁岛间做起了自己最擅长的活计：替毒贩跑腿。或许，做出改变的时候到了。
            </div>
            <ImageContainer src={Jason_Duval_01} className="mt-20 h-[1000px]" style={{ objectPosition: '80% center' }} />
          </div>

          <div className="grow w-0 shrink-0 pt-32">
            <ImageContainer
              src={Jason_Duval_02}
              className="mt-8 h-[800px]"
              style={{ width: '100vw', objectPosition: '30% center' }}
            />
            <ImageContainer src={Jason_Duval_06} className="mt-8 aspect-square" style={{ objectPosition: '40% center' }} />
          </div>
        </section>

        <Image src={videoImage_2} alt="" className="w-full h-auto" />
        <section className="end-pin">
          <div className="px-[10vw] text-7xl py-9 font-bold leading-[1.2] " style={{ color: '#fff9cb' }}>
            要是情况不对，转 <br /> 头叫我就好。
          </div>

          <section className="flex gap-10" style={{ padding: '10vh 15vw' }}>
            <div className="grow w-0 shrink-0 pt-32">
              <div className="text-5xl font-bold w-[300px] leading-[1.2] mx-auto" style={{ color: '#ffb0c4' }}>
                又一天快活日子，对吧？
              </div>
              <ImageContainer src={Jason_Duval_05} className="mt-8 aspect-square" style={{ objectPosition: '30% center' }} />
              <ImageContainer src={Jason_Duval_03} className="mt-8 aspect-square" style={{ objectPosition: '10% center' }} />
            </div>

            <div className="grow w-0 shrink-0 pt-32">
              <div className="text-2xl leading-[1.5] text-white">
                遇见露西娅，可能是他这辈子的万幸，又或者是不幸。杰森清楚自己想要的结果，但此刻，他有些彷徨。
              </div>
              <ImageContainer src={Jason_Duval_04} className="mt-8 aspect-9/16" style={{ objectPosition: '25% center' }} />
            </div>
          </section>
        </section>

        <Image src={videoImage_3} alt="" className="w-full h-auto" />
      </main> */}

      <div className="h-[10vh] bg-pink-300"></div>

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
