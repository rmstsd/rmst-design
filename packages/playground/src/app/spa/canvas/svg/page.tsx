'use client'

// https://aistudio.google.com/prompts/1p6y-XQrXVbwcjrUcCE1aWCfx_aqx9Y66

import { useRef, useState } from 'react'
import { applyToPoint, identity, inverse, scale, toCSS, transform, translate } from 'transformation-matrix'
import { Matrix } from 'pixi.js'

const mt = new Matrix().translate(10, 10)
mt.scale(2, 2)

let zoom = 1
export default function Page(props) {
  const [mt, setMt] = useState(() => identity())
  const domRef = useRef<HTMLDivElement>(null)

  const transformString = `matrix(${mt.a}, ${mt.b}, ${mt.c}, ${mt.d}, ${mt.e}, ${mt.f})`

  return (
    <div
      className="border m-6"
      style={{ width: 600, height: 400 }}
      ref={domRef}
      onWheel={evt => {
        const { clientX, clientY, deltaY } = evt
        const rect = domRef.current.getBoundingClientRect()

        let newZoom = deltaY > 0 ? zoom / 1.1 : zoom * 1.1
        const deltaZoom = newZoom / zoom

        let origin = { x: clientX - rect.left, y: clientY - rect.top }

        {
          origin = applyToPoint(inverse(mt), origin)
          const deltaMt = transform(translate(origin.x, origin.y), scale(deltaZoom, deltaZoom), translate(-origin.x, -origin.y))
          const newMt = transform(mt, deltaMt)
          setMt(newMt)
        }

        // {
        //   const deltaMt = new Matrix()
        //   deltaMt.translate(-origin.x, -origin.y).scale(deltaZoom, deltaZoom).translate(origin.x, origin.y)
        //   mt.prepend(deltaMt)
        //   setMt(mt.clone())
        // }

        zoom = newZoom
      }}
    >
      <svg viewBox="0 0 600 400" width={600} height={400}>
        <g transform={transformString}>
          <rect width={100} height={100} x={100} y={100} />
        </g>
      </svg>
    </div>
  )
}
