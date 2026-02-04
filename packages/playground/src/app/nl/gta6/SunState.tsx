import Image from 'next/image'
import icon from './assets/阳光之州不容错过的风光/visit-leonida.ed170c18.svg'
import overlay from './assets/阳光之州不容错过的风光/overlay.webp'

export function SunState(props) {
  return (
    <div>
      <div className="flex">
        <Image src={icon} alt="" className="w-12 h-12 absolute top-10 right-10" />
        阳光之州不容错过的风光
      </div>
      <Image src={overlay} alt="" className="w-full h-full object-cover" />
    </div>
  )
}
