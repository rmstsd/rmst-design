import { Image } from 'rmst-design'
import './ImageContainer.scss'
import clsx from 'clsx'
import { HTMLAttributes } from 'react'

export default function ImageContainer(props: HTMLAttributes<HTMLImageElement> & { src }) {
  const { src, className, ...rest } = props

  return (
    <Image
      src={src.src}
      alt=""
      {...rest}
      className={clsx('gta-image', className)}
      kfaOptions={{ duration: 400, easing: 'ease-in-out' }}
    />
  )
}
