import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { fitAndPosition } from 'object-fit-math'

import { Mask } from '../Mask'
import { on } from '../_util/dom'
import { Portal } from '../Portal'

import './style.less'
import { Button } from '../Button'
import { kfOptions, useAnTransition } from '../_util/hooks'
import { startDrag } from '../_util/drag'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  kfaOptions?: KeyframeAnimationOptions
}

const defaultProps: ImageProps = {
  kfaOptions: kfOptions
}

export function Image(props: ImageProps) {
  props = { ...defaultProps, ...props }
  const { src, kfaOptions, ...restProps } = props

  const imageRef = useRef<HTMLImageElement>(null)
  const previewImageRef = useRef<HTMLImageElement>(null)
  const [previewImageStyle, setPreviewImageStyle] = useState<React.CSSProperties>({})

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

      updatePosition()
    })

    return abort
  }, [])

  const updatePosition = useEffectEvent(() => {
    const previewImage = previewImageRef.current

    const rect = fitAndPosition(
      { width: window.innerWidth, height: window.innerHeight },
      { width: previewImage.naturalWidth, height: previewImage.naturalHeight },
      'contain'
    )

    const { x, y, width, height } = rect
    setPreviewImageStyle({ left: x, top: y, width: width, height: height })
  })

  const onPreviewImageLoad = () => {
    setDisplay(true)
    updatePosition()
  }

  const show = () => {
    const previewImage = previewImageRef.current
    previewImage.style.removeProperty('opacity')

    const startRect = imageRef.current.getBoundingClientRect()
    const endRect = previewImage.getBoundingClientRect()

    const objectFit = getComputedStyle(imageRef.current).objectFit
    const objectPosition = getComputedStyle(imageRef.current).objectPosition
    previewImage.style.objectFit = objectFit
    previewImage.style.objectPosition = objectPosition

    const kfs = [
      { left: `${startRect.left}px`, top: `${startRect.top}px`, width: `${startRect.width}px`, height: `${startRect.height}px` },
      { left: `${endRect.left}px`, top: `${endRect.top}px`, width: `${endRect.width}px`, height: `${endRect.height}px` }
    ]
    previewImage.animate(kfs, kfaOptions)
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
    animationRef.current = previewImage.animate(kfs, { ...kfaOptions, fill: 'forwards' })

    animationRef.current.onfinish = () => {
      setPreviewImageStyle({})
      setPreview(false)
      animationRef.current = null
    }
  }

  const { shouldMount, setDomRef } = useAnTransition({ open: display, keyframes: [{ opacity: 0 }, { opacity: 1 }] })

  const onPreviewImagePointerDown = (downEvt: React.PointerEvent) => {
    let downStyle = { ...previewImageStyle }

    startDrag(downEvt, {
      onDragStart(downEvt) {},
      onDragMove(moveEvt) {
        const dx = moveEvt.clientX - downEvt.clientX
        const dy = moveEvt.clientY - downEvt.clientY

        setPreviewImageStyle({ ...downStyle, left: (downStyle.left as number) + dx, top: (downStyle.top as number) + dy })
      },
      onDragEnd(upEvt) {
        if (upEvt.clientY > downEvt.clientY) {
          hide()
        } else {
          previewImageRef.current.style.transition = 'top 0.3s ease, left 0.3s ease'
          previewImageRef.current.addEventListener(
            'transitionend',
            () => {
              previewImageRef.current.style.removeProperty('transition')
            },
            { once: true }
          )
          updatePosition()
        }
      }
    })
  }

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
              onPointerDown={onPreviewImagePointerDown}
              onDragStart={evt => evt.preventDefault()}
            />

            {shouldMount && <Button ref={setDomRef} className="close" icon={<X />} onClick={hide} type="text"></Button>}
          </div>
        </Portal>
      )}
    </>
  )
}
