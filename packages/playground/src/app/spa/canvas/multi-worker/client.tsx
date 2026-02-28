'use client'

import { fps } from '@/utils/fps'
import { cloneDeep } from 'es-toolkit'
import { useEffect, useRef } from 'react'
import { startDrag } from 'rmst-design'

import { compose, identity, translate } from 'transformation-matrix'

export default function Client() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wks = Array.from({ length: 10 }, () => {
      const url = new URL('./renderer.worker.ts', import.meta.url)
      const worker = new Worker(url)
      return worker
    })

    const container = document.querySelector('.c-container')
    const canvas = canvasRef.current

    let mt = identity()

    const ctx = canvas.getContext('2d')

    const rects = Array.from({ length: 5_0000 }, () => ({
      x: Math.random() * container.clientWidth,
      y: Math.random() * container.clientHeight,
      w: 5,
      h: 5,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    }))

    canvas.onpointerdown = async evt => {
      let downMt = cloneDeep(mt)
      startDrag(evt, {
        onDragMove: moveEvt => {
          const tmt = translate(moveEvt.clientX - evt.clientX, moveEvt.clientY - evt.clientY)
          mt = compose(tmt, downMt)

          draw()
        }
      })
    }

    const draw = async () => {
      // ctx.resetTransform()
      // ctx.clearRect(0, 0, canvas.width, canvas.height)

      // ctx.setTransform(mt.a, mt.b, mt.c, mt.d, mt.e, mt.f)

      // rects.forEach(r => {
      //   ctx.fillStyle = r.color
      //   ctx.fillRect(r.x, r.y, r.w, r.h)
      // })

      // return

      const plist = wks.map((worker, index) => {
        // 根据 wks 的数量，将 rects 分割
        const chunk = rects.slice(index * (rects.length / wks.length), (index + 1) * (rects.length / wks.length))

        worker.postMessage({
          type: 'render',
          payload: { chunk, mt }
        })

        return new Promise<ImageBitmap>(resolve => {
          worker.onmessage = evt => {
            const { type, payload } = evt.data

            switch (type) {
              case 'render': {
                const { imageBitmap } = payload
                resolve(imageBitmap)
                break
              }
            }
          }
        })
      })

      const imageBitmaps = await Promise.all(plist)
      ctx.resetTransform()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      imageBitmaps.forEach(imageBitmap => {
        ctx.drawImage(imageBitmap, 0, 0)

        imageBitmap.close()
      })
    }

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight

      wks.forEach(worker => {
        worker.postMessage({
          type: 'resize',
          payload: { width: canvas.width, height: canvas.height }
        })
      })
      draw()
    })

    resizeObserver.observe(container)

    fps(fps => {
      document.querySelector('.fps-c').textContent = fps
    })

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className=" h-full c-container relative">
      <div className="absolute top-0 left-0 z-10  border bg-amber-600 text-white fps-c p-2"></div>

      <canvas className="absolute" ref={canvasRef}></canvas>
    </div>
  )
}
