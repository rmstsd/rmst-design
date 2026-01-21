'use client'

import { useEffect } from 'react'
import { genRects } from '../constant'
import { throttle } from 'es-toolkit'

export default function Native() {
  useEffect(() => {
    const canvas = document.querySelector('canvas')

    canvas.width = canvas.parentElement.clientWidth
    canvas.height = canvas.parentElement.clientHeight

    const ctx = canvas.getContext('2d')

    const rects = genRects(1_0000, canvas.clientWidth, canvas.clientHeight)

    drawCanvas()

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
        {
          // ctx.putImageData(dd, tx, ty)
          // return
        }

        ctx.save()
        ctx.translate(tx, ty)
        drawCanvas()
        ctx.restore()
      }
    }, 1000 / 144)

    document.addEventListener('pointermove', moveHandler)

    let tx = 0
    let ty = 0

    document.addEventListener('pointerup', () => {
      isPointerDown = false
    })

    function drawRect(rect) {
      // ctx.beginPath()

      const { x, y, width, height } = rect
      ctx.rect(x, y, width, height)
    }

    function drawCanvas() {
      ctx.beginPath()

      rects.forEach(rect => {
        drawRect(rect)
      })

      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
      ctx.fill()

      // dd = ctx.getImageData(0, 0, canvas.width, canvas.height)
    }
  }, [])

  return (
    <div className="h-full">
      <canvas width="400" height="800" className="touch-none"></canvas>
    </div>
  )
}
