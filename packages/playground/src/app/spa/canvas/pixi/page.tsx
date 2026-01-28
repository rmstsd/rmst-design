'use client'

import { useEffect } from 'react'
import { Application, Container, Graphics } from 'pixi.js'
import { randomInt } from 'es-toolkit'
import { fps } from '@/utils/fps'

export default function PixiTest() {
  useEffect(() => {
    fps(fps => {
      document.querySelector('.fps-cc').textContent = fps.toString()
    })

    const init = async () => {
      const container: HTMLDivElement = document.querySelector('.pixi')
      const rect = container.getBoundingClientRect()

      let prevPosition = { x: 0, y: 0 }

      container.addEventListener('pointerdown', evt => {
        prevPosition.x = evt.clientX
        prevPosition.y = evt.clientY
      })

      document.addEventListener('pointermove', evt => {
        if (evt.pressure) {
          const dx = evt.clientX - prevPosition.x
          const dy = evt.clientY - prevPosition.y

          prevPosition.x = evt.clientX
          prevPosition.y = evt.clientY

          // app.stage.position.set(app.stage.position._x + dx, app.stage.position._y + dy)

          randomRects.forEach(({ rectGh }) => {
            rectGh.position.set(rectGh.position._x + dx, rectGh.position._y + dy)
          })
        }
      })

      const app = new Application()

      await app.init({ width: container.clientWidth, height: container.clientHeight, backgroundColor: '#fff' })

      const randomRects = Array.from({ length: 10_0000 }, () => {
        const x = randomInt(20, rect.width - 40)
        const y = randomInt(20, rect.height - 40)
        const width = randomInt(10, 20)
        const height = randomInt(10, 20)
        const fill = Math.floor(Math.random() * 0xffffff)

        const gh = new Graphics()
        const rectGh = gh.rect(x, y, width, height).fill(fill)
        app.stage.addChild(rectGh)

        return { x, y, width, height, fill, rectGh }
      })

      container.appendChild(app.canvas)
    }

    init()
  }, [])

  return (
    <>
      <div className="fps-cc fixed top-2 left-2 bg-amber-400 p-2 text-white select-none"></div>
      <div className="pixi h-full"></div>
    </>
  )
}
