import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import './style.less'
import { Mask } from '../Mask'

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

  const handleClick = () => {
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
  }, [display])

  useEffect(() => {
    const onResize = () => {
      const previewImage = previewImageRef.current
      if (!previewImage) {
        return
      }
      const { x, y, width, height } = getPosition(previewImage.naturalWidth, previewImage.naturalHeight)
      setPreviewImageStyle({ left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px` })
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const hide = () => {
    const previewImage = previewImageRef.current
    const startRect = previewImage.getBoundingClientRect()
    const endRect = imageRef.current.getBoundingClientRect()

    const animation = previewImage.animate(
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

    animation.onfinish = () => {
      setPreviewImageStyle({})
      setPreview(false)
      setDisplay(false)
    }
  }

  return (
    <>
      <img src={src} ref={imageRef} style={{ maxWidth: 400 }} onClick={handleClick}></img>

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

function getPosition(naturalWidth, naturalHeight) {
  const { innerWidth, innerHeight } = window

  const containerRatio = innerWidth / innerHeight
  const imageRatio = naturalWidth / naturalHeight

  if (containerRatio > imageRatio) {
    const width = imageRatio * innerHeight
    const height = innerHeight

    const x = (innerWidth - width) / 2
    const y = 0

    return { x, y, width, height }
  } else {
    const width = innerWidth
    const height = innerWidth / imageRatio

    const x = 0
    const y = (innerHeight - height) / 2

    return { x, y, width, height }
  }
}
