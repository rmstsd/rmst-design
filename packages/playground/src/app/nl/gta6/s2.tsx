import Image from 'next/image'
import outro from './assets/outro.webp'

export default function S2(props) {
  return (
    <div>
      <Image src={outro} alt="" className=" w-full h-screen object-cover" />
    </div>
  )
}
