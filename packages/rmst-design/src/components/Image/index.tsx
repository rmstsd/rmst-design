import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { fitAndPosition } from 'object-fit-math'

import { Mask } from '../Mask'
import { on } from '../_util/dom'
import { Portal } from '../Portal'

import './style.less'
import { Button } from '../Button'
import { kfOptions, useAnTransition } from '../_util/hooks'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function Image(props: ImageProps) {
  const { src, ...restProps } = props

  const imageRef = useRef<HTMLImageElement>(null)
  const previewImageRef = useRef<HTMLImageElement>(null)
  const [previewImageStyle, setPreviewImageStyle] = useState({})

  const [preview, setPreview] = useState(false)
  const [display, setDisplay] = useState(false)

  const animationRef = useRef<Animation>(null)

  const handleOriginClick = () => {
    setPreview(true)
  }

  useLayoutEffect(() => {
    if (preview) {
      previewImageRef.current.style.opacity = '0'
    }
  }, [preview])

  useLayoutEffect(() => {
    if (display) {
      show()
    }
  }, [display])

  useEffect(() => {
    const abort = on(window, 'resize', () => {
      const previewImage = previewImageRef.current
      if (!previewImage) {
        return
      }

      const { x, y, width, height } = getPosition()
      setPreviewImageStyle({ left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px` })
    })

    return abort
  }, [])

  const getPosition = () => {
    const previewImage = previewImageRef.current

    const rect = fitAndPosition(
      { width: window.innerWidth, height: window.innerHeight },
      { width: previewImage.naturalWidth, height: previewImage.naturalHeight },
      'contain'
    )

    return rect
  }

  const onPreviewImageLoad = () => {
    const previewImage = previewImageRef.current

    setDisplay(true)

    const { x, y, width, height } = getPosition()
    setPreviewImageStyle({ left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px` })
  }

  const show = () => {
    const previewImage = previewImageRef.current
    previewImage.style.removeProperty('opacity')

    const startRect = imageRef.current.getBoundingClientRect()
    const endRect = previewImage.getBoundingClientRect()

    const objectFit = getComputedStyle(imageRef.current).objectFit
    previewImage.style.objectFit = objectFit

    const kfs = [
      { left: `${startRect.left}px`, top: `${startRect.top}px`, width: `${startRect.width}px`, height: `${startRect.height}px` },
      { left: `${endRect.left}px`, top: `${endRect.top}px`, width: `${endRect.width}px`, height: `${endRect.height}px` }
    ]
    previewImage.animate(kfs, kfOptions)
  }

  const hide = () => {
    if (animationRef.current) {
      return
    }

    setDisplay(false)
    const previewImage = previewImageRef.current
    const startRect = previewImage.getBoundingClientRect()
    const endRect = imageRef.current.getBoundingClientRect()

    const kfs = [
      { left: `${startRect.left}px`, top: `${startRect.top}px`, width: `${startRect.width}px`, height: `${startRect.height}px` },
      { left: `${endRect.left}px`, top: `${endRect.top}px`, width: `${endRect.width}px`, height: `${endRect.height}px` }
    ]
    animationRef.current = previewImage.animate(kfs, { ...kfOptions, fill: 'forwards' })

    animationRef.current.onfinish = () => {
      setPreviewImageStyle({})
      setPreview(false)
      animationRef.current = null
    }
  }

  const { shouldMount, setDomRef } = useAnTransition({ open: display, keyframes: [{ opacity: 0 }, { opacity: 1 }] })

  return (
    <>
      <img {...restProps} src={src} ref={imageRef} onClick={handleOriginClick}></img>

      {preview && (
        <Portal>
          <div className="rmst-preview-image-container">
            <Mask onClick={hide} open={display} />

            <img
              className="preview-image"
              ref={previewImageRef}
              src={src}
              style={{ ...previewImageStyle }}
              onLoad={onPreviewImageLoad}
            />

            {shouldMount && <Button ref={setDomRef} className="close" icon={<X />} onClick={hide} type="text"></Button>}
          </div>
        </Portal>
      )}
    </>
  )
}
