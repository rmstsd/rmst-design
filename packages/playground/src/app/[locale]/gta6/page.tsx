'use client'

import Image from 'next/image'
import firstBanner from './assets/firstBanner.webp'
import gtaLogoHHead from './assets/gtaLogoHHead.webp'
import gtaLogo from './assets/gtaLogo.svg'
import gtaVi from './assets/gtaVi.png'

import videoImage_1 from './assets/videoImage_1.webp'
import videoImage_2 from './assets/videoImage_2.webp'
import videoImage_3 from './assets/videoImage_3.webp'

import Jason_Duval_01 from './assets/Jason_Duval_01.webp'

import './page.scss'
import { useEffect, useRef, useState } from 'react'
import { createAnimation, spFn } from './ant'
import ImageContainer from './ImageContainer/ImageContainer'

const $ = selector => {
  const el = document.querySelector(selector) as HTMLElement

  if (!el) {
    return document.createElement('div')
  }

  return el
}

export default function Gta6() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    })

    if (!isVisible) {
      return
    }

    const update = scrollTop => {
      spFn({ scrollValue: scrollTop, scrollStart: 0, scrollEnd: 200, valueStart: 1, valueEnd: 0 }, value => {
        $('.logo-head').style.opacity = `${value}`
      })

      spFn({ scrollValue: scrollTop, scrollStart: 0, scrollEnd: 200, valueStart: 130, valueEnd: 100 }, value => {
        $('.first-banner').style.width = `${value}vw`
        $('.first-banner').style.height = `${value}vh`
        $('.first-banner').style.marginLeft = `${-(value - 100) / 2}vw`
        $('.first-banner').style.marginTop = `${-(value - 100) / 2}vh`

        $('.logo-head').style.width = `${value}vw`
        $('.logo-head').style.height = `${value}vh`
        $('.logo-head').style.marginLeft = `${-(value - 100) / 2}vw`
        $('.logo-head').style.marginTop = `${-(value - 100) / 2}vh`
      })

      spFn({ scrollValue: scrollTop, scrollStart: 200, scrollEnd: 600, valueStart: 1, valueEnd: 0 }, value => {
        $('.banner-inner').style.opacity = `${value}`
      })

      if (scrollTop < 900) {
        spFn({ scrollValue: scrollTop, scrollStart: 500, scrollEnd: 1000, valueStart: 0, valueEnd: 1 }, value => {
          $('.fs-text').style.opacity = value
        })
      } else if (900 < scrollTop) {
        spFn({ scrollValue: scrollTop, scrollStart: 1000, scrollEnd: 1500, valueStart: 1, valueEnd: 0 }, value => {
          $('.fs-text').style.opacity = value
        })
      }

      spFn({ scrollValue: scrollTop, scrollStart: 1500, scrollEnd: 2000, valueStart: 0, valueEnd: 1 }, value => {
        $('.ze-text').style.opacity = value
      })
    }

    update(containerRef.current.scrollTop)

    const abCt = new AbortController()
    containerRef.current.addEventListener(
      'scroll',
      () => {
        update(containerRef.current.scrollTop)
      },
      { signal: abCt.signal }
    )

    return () => {
      abCt.abort()
      setIsVisible(false)
    }
  }, [isVisible])

  // if (!isVisible) {
  //   return null
  // }

  const test = <div className="test-bg h-screen bg-purple-100" style={{ backgroundImage: `url('${gtaVi.src}')` }}></div>

  return (
    <div className="gta overflow-auto fixed z-20 inset-0 bg-white" ref={containerRef}>
      {/* {test} */}

      <div className="playground bg-gray-700" style={{ height: '300vh' }}>
        <div
          className="banner-container overflow-clip"
          style={
            {
              // maskImage: `url(${gtaLogo.src})`
            }
          }
        >
          <div className="banner-inner ">
            <Image src={firstBanner} alt="" className="first-banner object-cover absolute top-0" />
            <Image src={gtaLogoHHead} alt="" className="logo-head object-cover absolute top-0" />
          </div>
        </div>

        <main className="fs-text  h-screen sticky w-full z-10 top-0 bg-gray-900 flow-root" style={{ marginTop: '-130vh' }}>
          <Image src={gtaVi} alt="" className="mx-auto" style={{ height: 80, width: 'auto', marginTop: 200 }} />
          <div className="text-white text-center font-bold" style={{ fontSize: 88, lineHeight: 1.2 }}>
            2026年
            <br />
            11月19日
            <br />
            敬请期待
          </div>
        </main>

        <main
          className="ze-text h-screen sticky w-full z-10 top-0 bg-gray-900 flow-root bg-clip-text font-bold "
          style={{
            color: 'transparent',
            padding: '20vh',
            backgroundImage:
              'radial-gradient(circle at 42.792% 55.84vh, rgb(255, 188, 132) 0%, rgb(244, 75, 89) 54.644%, rgb(139, 40, 104) 80.456%, rgba(32, 31, 66, 0) 122.08%)'
          }}
        >
          <div style={{ fontSize: 77 }}>美国罪恶城</div>
          <div style={{ fontSize: 26 }}>
            杰森和露西娅心里一直清楚，命运对他们不公。本应简单的行动出了差错，美国阳光最灿烂的地方向两人展露出它最阴暗的一面，将他们卷入一场横跨雷奥奈达的犯罪阴谋。若想活着逃出生天，他们比以往任何时候都更需要彼此依靠。
          </div>
        </main>
      </div>

      <section className="bg-gray-900">
        <Image src={videoImage_1} alt="" className="w-full h-auto" />

        <div className="" style={{ padding: '10vh 10vw' }}>
          <ImageContainer src={Jason_Duval_01} />
        </div>

        <Image src={videoImage_2} alt="" className="w-full h-auto" />
        <Image src={videoImage_3} alt="" className="w-full h-auto" />
      </section>

      <div style={{ height: 1000 }}></div>
    </div>
  )
}
