import Image from 'next/image'

import videoImage_1 from './assets/videoImage_1.webp'
import videoImage_2 from './assets/videoImage_2.webp'
import videoImage_3 from './assets/videoImage_3.webp'
import videoImage_4 from './assets/videoImage_4.webp'

import Jason_Duval_01 from './assets/Jason_Duval_01.webp'
import Jason_Duval_02 from './assets/Jason_Duval_02.webp'
import Jason_Duval_06 from './assets/Jason_Duval_06.webp'

import Jason_Duval_05 from './assets/Jason_Duval_05.webp'
import Jason_Duval_03 from './assets/Jason_Duval_03.webp'
import Jason_Duval_04 from './assets/Jason_Duval_04.webp'

import Lucia_Caminos_01 from './assets/露西娅·卡米诺斯/Lucia_Caminos_01.webp'
import Lucia_Caminos_02 from './assets/露西娅·卡米诺斯/Lucia_Caminos_02.webp'
import Lucia_Caminos_05 from './assets/露西娅·卡米诺斯/Lucia_Caminos_05.webp'

import ImageContainer from './ImageContainer/ImageContainer'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import gsap from 'gsap'
import { GSDevTools } from 'gsap/GSDevTools'

export default function S1(props) {
  const s1Ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      {
        const tl = gsap.timeline({
          defaults: { duration: 2 },
          scrollTrigger: {
            trigger: '.s1-img-1',
            start: 'top top',
            endTrigger: '.s1-content-1',
            end: 'top top',
            scrub: true,
            pin: true,
            pinSpacing: false
            // markers: true
          }
        })
        // tl.pause()
        // GSDevTools.create({ animation: tl })
        tl.to('.s1-img-1', { opacity: 0 })
      }

      const list = [
        { imgCls: '.s1-img-2', contentCls: '.s1-content-2' },
        { imgCls: '.s1-img-3', contentCls: '.s1-content-3' },
        { imgCls: '.s1-img-4', contentCls: '.s1-content-4' }
      ]

      list.forEach(item => {
        gsap.set(item.imgCls, { marginTop: '-100vh' })

        const tl = gsap.timeline({
          defaults: { duration: 2 },
          scrollTrigger: {
            trigger: item.imgCls,
            start: 'top top',
            endTrigger: item.contentCls,
            end: 'top top',
            scrub: true,
            pin: true,
            pinSpacing: false,
            markers: true
          }
        })
        tl.from(item.imgCls, { opacity: 0 })
        tl.to(item.imgCls, { opacity: 0 })
      })

      {
        return
        const tl = gsap.timeline({
          defaults: { duration: 2 },
          scrollTrigger: {
            trigger: '.s1-img-2',
            start: 'top top',
            endTrigger: '.s1-content-2',
            end: 'top top',
            scrub: true,
            pin: true,
            pinSpacing: false,
            markers: true
          }
        })
        // tl.pause()
        // GSDevTools.create({ animation: tl })
        tl.from('.s1-img-2', { opacity: 0 })
        tl.to('.s1-img-2', { opacity: 0 })
      }
    },
    { scope: s1Ref.current }
  )

  return (
    <main ref={s1Ref} className="bg-gray-900 relative z-10">
      <Image src={videoImage_1} alt="" className="s1-img-1 w-full h-screen object-cover" />
      <section className="s1-content-1 flex gap-10 relative z-10" style={{ padding: '10vh 15vw' }}>
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

      <Image src={videoImage_2} alt="" className="s1-img-2 w-full h-screen object-cover" style={{ marginTop: '' }} />
      <section className="s1-content-2 relative z-10" style={{ marginTop: '50vh' }}>
        <div className="px-[10vw] text-7xl py-9 font-bold leading-[1.2]" style={{ color: '#fff9cb' }}>
          要是情况不对，转
          <br />
          头叫我就好。
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
            <div className="text-2xl leading-normal text-white">
              遇见露西娅，可能是他这辈子的万幸，又或者是不幸。杰森清楚自己想要的结果，但此刻，他有些彷徨。
            </div>
            <ImageContainer src={Jason_Duval_04} className="mt-8 aspect-9/16" style={{ objectPosition: '25% center' }} />
          </div>
        </section>
      </section>

      <Image src={videoImage_3} alt="" className="s1-img-3 w-full h-screen object-cover" style={{ marginTop: '' }} />
      <section className="s1-content-3 text-white border relative z-10 " style={{ marginTop: '50vh' }}>
        <div className="flex px-[10vw] gap-10">
          <div>
            <ImageContainer src={Lucia_Caminos_01} className="mt-20 aspect-square" />
            <ImageContainer src={Lucia_Caminos_05} className="mt-20 aspect-9/16" style={{ objectPosition: '60%' }} />
          </div>
          <div>
            <div className="px-[10vw] text-7xl py-9 font-bold leading-[1.2]" style={{ color: '#fff9cb' }}>
              露西娅·卡米诺斯
            </div>
            <div className="text-5xl px-4 m-4" style={{ color: '#ffb0c4' }}>
              露西娅刚会走路，她的父亲就教会了她打架。
            </div>
            <div className="text-white text-3xl m-8">
              此后，生活与她便成了擂台上的对手。为了家人，她进了雷奥奈达监狱，却又阴差阳错得以获释。露西娅从中吸取了教训，接下来，每一步都得精打细算。
            </div>

            <ImageContainer src={Lucia_Caminos_02} className="mt-20 aspect-square" />

            <div className="text-white text-3xl leading-relaxed" style={{ margin: 100 }}>
              早在母女二人住在自由城时，露西娅的母亲就梦想着更美好的生活。这种生活也是露西娅最执着的追求。如今她不再沉浸于不切实际的幻想，而是准备亲手争取出一片未来。
            </div>
          </div>
        </div>
      </section>

      <div className="relative s1-img-4 w-full h-screen " style={{ marginTop: '' }}>
        <Image src={videoImage_4} alt="" className=" w-full h-full object-cover" />
        <div className="absolute bottom-0 text-7xl font-bold " style={{ color: '#fff9cb', margin: 60 }}>
          这世上最重要的，只有你打交道的人，和手里的钱。
        </div>
      </div>

      <section className="s1-content-4 text-white border relative z-10" style={{ marginTop: '50vh' }}>
        {[...Array(20).keys()].map((item, index) => (
          <div key={index} className=" text-center m-10 bg-slate-700">
            {index}
          </div>
        ))}
      </section>
    </main>
  )
}
