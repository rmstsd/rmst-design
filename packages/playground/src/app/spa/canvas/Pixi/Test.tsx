import { useEffect } from 'react'
import { Application, Container, Graphics } from 'pixi.js'
import { randomInt } from 'es-toolkit'

export default function PixiTest() {
  useEffect(() => {
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

          app.stage.position.set(app.stage.position._x + dx, app.stage.position._y + dy)
        }
      })

      const app = new Application()

      await app.init({ width: container.clientWidth, height: container.clientHeight, backgroundColor: '#fff' })

      const randomRects = Array.from({ length: 15000 }, () => {
        const x = randomInt(20, rect.width - 40)
        const y = randomInt(20, rect.height - 40)
        const width = randomInt(10, 20)
        const height = randomInt(10, 20)
        const fill = Math.floor(Math.random() * 0xffffff)
        return { x, y, width, height, fill }
      })

      randomRects.forEach(({ x, y, width, height, fill }) => {
        const gh = new Graphics()
        const rect = gh.rect(x, y, width, height).fill(fill)
        app.stage.addChild(rect)
      })

      container.appendChild(app.canvas)
    }

    init()
  }, [])

  return <div className="pixi h-full"></div>
}
