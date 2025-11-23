import { Image } from 'rmst-design'
import './ImageContainer.scss'
import clsx from 'clsx'

export default function ImageContainer(props) {
  const { src, ...rest } = props

  return <Image src={src.src} alt="" className={clsx('gta-image')} kfaOptions={{ duration: 400, easing: 'ease-in-out' }} />
}
