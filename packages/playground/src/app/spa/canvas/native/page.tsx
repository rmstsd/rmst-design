'use client'

import { useEffect } from 'react'
import { genRects } from '../constant'
import { throttle } from 'es-toolkit'
import { fps } from '@/utils/fps'

export default function Native() {
  useEffect(() => {
    fps(fps => {
      document.querySelector('.fps-cc').textContent = fps.toString()
    })

    const offscreen = new OffscreenCanvas(400, 800)
    const offscreenCtx = offscreen.getContext('2d')

    const wait = 1000 / 90

    const canvas = document.querySelector('canvas')
    canvas.width = canvas.parentElement.clientWidth
    canvas.height = canvas.parentElement.clientHeight

    const ctx = canvas.getContext('2d')

    const rects = genRects(5_0000, canvas.clientWidth, canvas.clientHeight)
    let now = performance.now()
    drawCanvas()
    const bitImage = offscreen.transferToImageBitmap()

    let isPointerDown = false
    let prevX = 0
    let prevY = 0

    canvas.addEventListener('click', () => {})

    canvas.addEventListener('pointerdown', event => {
      event.preventDefault()

      isPointerDown = true
      prevX = event.clientX
      prevY = event.clientY
    })

    const moveHandler = throttle(event => {
      if (isPointerDown) {
        event.clientX - prevX
        event.clientY - prevY
        tx += event.clientX - prevX
        ty += event.clientY - prevY
        prevX = event.clientX
        prevY = event.clientY

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.save()
        ctx.translate(tx, ty)

        // drawCanvas()
        // const bitImage = offscreen.transferToImageBitmap()

        ctx.drawImage(bitImage, 0, 0)
        ctx.restore()
      }
    }, 1000 / 90)

    document.addEventListener('pointermove', moveHandler)

    let tx = 0
    let ty = 0

    document.addEventListener('pointerup', () => {
      isPointerDown = false
    })

    function drawRect(rect) {
      offscreenCtx.beginPath()

      const { x, y, width, height, fill } = rect
      offscreenCtx.rect(x, y, width, height)

      offscreenCtx.fillStyle = fill
      offscreenCtx.fill()
    }

    function drawCanvas() {
      offscreenCtx.beginPath()

      rects.forEach(rect => {
        drawRect(rect)
      })
    }
  }, [])

  return (
    <div className="h-full">
      <div className="fps-cc fixed top-2 left-2 bg-amber-400 p-2 text-white select-none"></div>
      <canvas width="400" height="800" className="touch-none"></canvas>
    </div>
  )
}

// 随机颜色
function randomColor() {
  return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
}
