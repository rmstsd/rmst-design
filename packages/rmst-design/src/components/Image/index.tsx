import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import './style.less'
import { Mask } from '../Mask'
import { getPosition } from './util'
import { on } from '../_util/dom'

interface ImageProps {
  src: string
}

export function Image(props: ImageProps) {
  const { src } = props

  const imageRef = useRef<HTMLImageElement>(null)
  const previewImageRef = useRef<HTMLImageElement>(null)
  const [previewImageStyle, setPreviewImageStyle] = useState({})

  const [display, setDisplay] = useState(false)
  const [preview, setPreview] = useState(false)

  const animationRef = useRef<Animation>(null)

  const handleOriginClick = () => {
    setPreview(true)
  }

  const onPreviewImageLoad = () => {
    const previewImage = previewImageRef.current
    const { x, y, width, height } = getPosition(previewImage.naturalWidth, previewImage.naturalHeight)

    setDisplay(true)
    setPreviewImageStyle({ left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px` })
  }

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
      const { x, y, width, height } = getPosition(previewImage.naturalWidth, previewImage.naturalHeight)
      setPreviewImageStyle({ left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px` })
    })

    return abort
  }, [])

  const show = () => {
    const previewImage = previewImageRef.current
    const startRect = imageRef.current.getBoundingClientRect()
    const endRect = previewImage.getBoundingClientRect()

    previewImage.animate(
      [
        {
          left: `${startRect.left}px`,
          top: `${startRect.top}px`,
          width: `${startRect.width}px`,
          height: `${startRect.height}px`
        },
        {
          left: `${endRect.left}px`,
          top: `${endRect.top}px`,
          width: `${endRect.width}px`,
          height: `${endRect.height}px`
        }
      ],
      { duration: 300, easing: 'ease-in-out' }
    )
  }

  const hide = () => {
    if (animationRef.current) {
      return
    }

    const previewImage = previewImageRef.current
    const startRect = previewImage.getBoundingClientRect()
    const endRect = imageRef.current.getBoundingClientRect()

    animationRef.current = previewImage.animate(
      [
        {
          left: `${startRect.left}px`,
          top: `${startRect.top}px`,
          width: `${startRect.width}px`,
          height: `${startRect.height}px`
        },
        {
          left: `${endRect.left}px`,
          top: `${endRect.top}px`,
          width: `${endRect.width}px`,
          height: `${endRect.height}px`
        }
      ],
      { duration: 300, easing: 'ease-in-out', fill: 'forwards' }
    )

    animationRef.current.onfinish = () => {
      setPreviewImageStyle({})
      setPreview(false)
      setDisplay(false)
      animationRef.current = null
    }
  }

  return (
    <>
      <img src={src} ref={imageRef} style={{ maxWidth: 400 }} onClick={handleOriginClick}></img>

      {preview &&
        createPortal(
          <div className="preview-container" style={{ display: display ? 'block' : 'none' }}>
            <Mask onClick={hide} />

            <img
              className="preview-image"
              ref={previewImageRef}
              src={src}
              style={previewImageStyle}
              onLoad={onPreviewImageLoad}
            />
          </div>,
          document.body
        )}
    </>
  )
}
