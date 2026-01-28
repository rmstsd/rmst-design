import Image from 'next/image'
import icon from './assets/阳光之州不容错过的风光/visit-leonida.ed170c18.svg'
import overlay from './assets/阳光之州不容错过的风光/overlay.webp'
import poster from './assets/阳光之州不容错过的风光/poster.webp'

export function SunState(props) {
  return (
    <div>
      <div className="flex justify-center items-center" style={{ height: 200 }}>
        <Image src={icon} alt="" className=" " style={{ height: 120 }} />
        <div className="text-white text-4xl">阳光之州不容错过的风光</div>
      </div>

      <div className="relative h-full mx-[10vh]">
        <Image src={poster} alt="" className="w-full h-full object-cover" />
        <Image src={overlay} alt="" className="absolute top-0 w-full h-full object-cover" />
      </div>
    </div>
  )
}
