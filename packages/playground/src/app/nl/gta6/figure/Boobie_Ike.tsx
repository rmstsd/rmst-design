import Boobie_Ike_01 from './assets/波比·艾克/Boobie_Ike_01.webp'
import Boobie_Ike_02 from './assets/波比·艾克/Boobie_Ike_02.webp'
import Boobie_Ike_03 from './assets/波比·艾克/Boobie_Ike_03.webp'
import Boobie_Ike_04 from './assets/波比·艾克/Boobie_Ike_04.webp'

import canvas_poster from './assets/波比·艾克/canvas_poster.webp'
import Hero_BG from './assets/波比·艾克/Hero_BG.webp'
import Hero_FG from './assets/波比·艾克/Hero_FG.webp'

import ImageContainer from '../components/ImageContainer/ImageContainer'
import { Person } from '../components/Person'

export default function BoobieIke(props) {
  return (
    <div>
      <Person
        Hero_BG={Hero_BG}
        Hero_FG={Hero_FG}
        name="波比·艾克"
        desc_1="一切源于心：红心杰克。"
        desc_2="波比是罪恶城的本地传奇，行事也如传奇一般。能从混迹街头走到坐拥合法产业帝国的人并不多，波比便是其中一个。他的疆域涵盖房地产、脱衣舞俱乐部和录音棚。波比总是笑容可掬，但谈生意的时候例外。"
      />

      <div className="flex  px-[10vw] gap-10">
        <div>
          <ImageContainer src={Boobie_Ike_04} className="mt-20 aspect-square" />
          <ImageContainer src={canvas_poster} className="mt-20 aspect-square" />
          <ImageContainer src={Boobie_Ike_02} className="mt-20 aspect-square" />
        </div>

        <div>
          <ImageContainer src={Boobie_Ike_01} className="mt-20 aspect-square" />
          <div>录音棚能靠俱乐部养着，但说到底，什么都得靠毒资养着。</div>
          <ImageContainer src={Boobie_Ike_03} className="mt-20 aspect-square" />
          <div>顶级金曲。</div>
          <div>
            波比看似只为自己打算，但他最看重的，其实是在纯声唱片这件事上，与年轻有为的音乐人德雷奎恩形成的合作关系。现在他们只缺打响名头的那一曲。
          </div>
        </div>
      </div>
    </div>
  )
}
