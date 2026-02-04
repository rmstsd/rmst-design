import Image from 'next/image'
import Cal_Hampton_01 from './assets/卡尔·汉普顿/Cal_Hampton_01.webp'
import Cal_Hampton_02 from './assets/卡尔·汉普顿/Cal_Hampton_02.webp'
import Cal_Hampton_03 from './assets/卡尔·汉普顿/Cal_Hampton_03.webp'
import Cal_Hampton_04 from './assets/卡尔·汉普顿/Cal_Hampton_04.webp'

import Cal_canvas_poster from './assets/卡尔·汉普顿/Cal_canvas_poster.webp'

import Hero_BG from './assets/卡尔·汉普顿/Hero_BG.webp'
import Hero_FG from './assets/卡尔·汉普顿/Hero_FG.webp'
import ImageContainer from '../components/ImageContainer/ImageContainer'
import { Person } from '../components/Person'

export function CalHampton(props) {
  return (
    <div>
      <Person
        Hero_BG={Hero_BG}
        Hero_FG={Hero_FG}
        name="卡尔·汉普顿"
        desc_1="万一网上说的都是真的呢？"
        desc_2="卡尔是杰森的朋友，跟着布莱恩干活。卡尔觉得最有安全感的事就是宅在家里，喝着啤酒，偷听海岸警卫队的通讯，用无痕模式逛逛网页。"
      />

      <div className="flex  px-[10vw] gap-10">
        <div>
          <ImageContainer src={Cal_Hampton_04} className="mt-20 aspect-square" />
          <ImageContainer src={Cal_canvas_poster} className="mt-20 aspect-square" />
          <ImageContainer src={Cal_Hampton_02} className="mt-20 aspect-square" />
        </div>

        <div>
          <ImageContainer src={Cal_Hampton_01} className="mt-20 aspect-square" />
          <div>那些鸟飞得也太整齐了。</div>
          <ImageContainer src={Cal_Hampton_03} className="mt-20 aspect-square" />
          <div>疯子当道。习惯就好。</div>
          <div>卡尔身处美国的底层社会，不过他乐在其中，偶尔有点偏执，喜欢有人陪伴。但他的朋友杰森却有更远大的抱负。</div>
        </div>
      </div>
    </div>
  )
}
