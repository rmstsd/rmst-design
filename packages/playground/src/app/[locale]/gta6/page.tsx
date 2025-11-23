'use client'

import Image from 'next/image'
import firstBanner from './assets/firstBanner.webp'
import gtaLogoHHead from './assets/gtaLogoHHead.webp'
import gtaLogo from './assets/gtaLogo.svg'
import gtaVi from './assets/gtaVi.png'

import './page.scss'
import { useEffect, useRef, useState } from 'react'
import { createAnimation, spFn } from './ant'

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

      spFn({ scrollValue: scrollTop, scrollStart: 500, scrollEnd: 900, valueStart: 0, valueEnd: 1 }, value => {
        $('.fs-text').style.opacity = value
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

  if (!isVisible) {
    return null
  }

  const test = <div className="test-bg h-screen bg-purple-100" style={{ backgroundImage: `url('${gtaVi.src}')` }}></div>

  return (
    <div className="gta overflow-auto fixed z-20 inset-0 bg-white" ref={containerRef}>
      {test}

      {/* <div className="playground bg-gray-700" style={{ height: '500vh' }}>
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
      </div> */}

      <div style={{ height: 1000 }}></div>
    </div>
  )
}
