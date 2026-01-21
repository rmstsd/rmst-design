'use client'

import { Application, Graphics, GraphicsPath } from 'pixi.js'
import { useEffect, useRef, useState } from 'react'

export default function Pixi() {
  const [container, setContainer] = useState<HTMLDivElement>()
  const appRef = useRef<Application>(null)

  useEffect(() => {
    if (!container) {
      return
    }

    init()

    return () => {
      appRef.current?.destroy(true)
    }
  }, [container])

  const init = async () => {
    const app = new Application()
    appRef.current = app

    await app.init({
      width: container.clientWidth,
      height: container.clientHeight,
      resizeTo: container,
      backgroundColor: '#fff',
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    })
    container.appendChild(app.canvas)

    {
      const path = new Graphics()
      path
        .path(
          new GraphicsPath(
            'M 274.157882891006,150.71258092125663 L222.37805292125813,148.21562110899958 L219.88109310900109,199.99545107874656 L271.66092307874897,202.4924108910036 Z'
          )
        )
        .stroke({ color: 'red' })

      app.stage.addChild(path)
    }
    // const rectItem = new Graphics().rect(100, 100, 300, 200).fill('red').stroke({ color: 'blue', width: 10 })
    // rectItem.setMask({ mask: new Graphics().rect(100, 100, 300, 200).fill('transparent') })
    // app.stage.addChild(rectItem)

    {
      return
      const rect = new Graphics().rect(-100, 100, 240, 240).fill('blue')
      rect.eventMode = 'static'
      rect.cursor = 'pointer'

      rect.on('click', evt => {
        console.log('click')
      })
      rect.on('pointerenter', evt => {
        const { x, y } = evt.global

        if (
          x >= app.screen.x &&
          y >= app.screen.y &&
          x <= app.screen.x + app.screen.width &&
          y <= app.screen.y + app.screen.height
        ) {
          console.log('enter')
        }
      })
      app.stage.addChild(rect)

      const rect2 = new Graphics().rect(500, 100, 240, 240).fill('blue')
      rect2.eventMode = 'static'
      rect2.cursor = 'pointer'

      rect2.on('click', evt => {
        console.log('click')
      })
      rect2.on('pointerenter', evt => {
        const { x, y } = evt.global
        if (
          x >= app.screen.x &&
          y >= app.screen.y &&
          x <= app.screen.x + app.screen.width &&
          y <= app.screen.y + app.screen.height
        ) {
          console.log('enter')
        }
      })

      app.stage.addChild(rect2)
    }

    return

    const p1 = { x: 100, y: 100 }
    const p2 = { x: 100, y: 200 }

    const line = new Graphics().moveTo(100, 100).lineTo(100, 200).lineTo(200, 200).closePath().stroke({ width: 4, color: 'red' })
    app.stage.addChild(line)

    // const basicText = new Text({ text: 'Basic text in pixi' })
    // basicText.x = 50
    // basicText.y = 100

    // basicText.eventMode = 'static'
    // basicText.cursor = 'pointer'
    // basicText.scale.set(1, -1)

    // app.stage.scale.set(1, -1)
    // app.stage.position.set(0, app.screen.height)

    // app.stage.setFromMatrix(trs.matrix)

    // app.stage.position.set(100, 100)
    // // app.stage.scale.set(2)
    // app.stage.angle = 45
    // app.stage.position.set(-100, -100)

    // app.stage.pivot.set(100, 100)
    // app.stage.position.set(100, 100)
    // app.stage.angle = 45

    // app.stage.position.set(100, 100)
    // app.stage.scale.set(25)

    // const rects = mapData.sites.map(item => {
    //   const rect = gh.rect(item.x - siteSize / 2, item.y - siteSize / 2, siteSize, siteSize).fill('red')

    //   rect.eventMode = 'static'
    //   rect.cursor = 'pointer'

    //   return rect
    // })
    // app.stage.addChild(...rects)

    // const mapRuntime = new SceneAreaMapRuntime(mapData as any)
    // {
    //   mapRuntime.paths.map(pathParams => {
    //     const path = pathParams.path1
    //     // 显示方向
    //     const daStart = 0.4
    //     const daShortSite = 1
    //     const daLongSite = 2.4

    //     const directionData = pathParams.dual
    //       ? `M${daStart},${-daShortSite} L${daStart},${daShortSite} L${daLongSite},0 L${daStart},${-daShortSite}`
    //       : `M${daStart},${-daShortSite} L${daStart},${daShortSite} L${daLongSite},0 L${daStart},${-daShortSite}
    //        M${-daStart},${-daShortSite} L${-daStart},${daShortSite} L${-daLongSite},0 L${-daStart},${-daShortSite}`

    //     let directionTransform = ''

    //     let middleX, middleY, middleDirDeg: number
    //     if (path.middlePoint) {
    //       middleDirDeg = ((path.middlePoint.tangent || 0) / Math.PI) * 180
    //       middleX = path.middlePoint.x
    //       middleY = -path.middlePoint.y
    //       directionTransform = `translate(${middleX}, ${middleY}) rotate(${middleDirDeg})`
    //     }

    //     const gItem = new Container()

    //     const path_main = new GraphicsPath(pathParams.d) // , fill: 'none', stroke: '#666', strokeWidth: 3 }

    //     // const path_direction = new Path({ path: directionData, fill: { type: 'solid', color: 'transparent' } })
    //     // path_direction.move(middleX, middleY)
    //     // path_direction.rotation = middleDirDeg
    //     gItem.addChild(
    //       gh.path(path_main)
    //       // path_direction
    //     )

    //     return gItem
    //   })
    // }

    // const g = new Container()
    // const rects2 = genRects(10, 500, 500, 60).map(rect => {
    //   const rectItem = new Graphics().rect(rect.x, rect.y, rect.width, rect.height).fill(rect.fill)
    //   rectItem.eventMode = 'static'
    //   rectItem.cursor = 'pointer'

    //   rectItem.onclick = () => {
    //     console.log('aaa')

    //     gh.clear()

    //     rects2.forEach(item => {
    //       item.rect(rect.x, rect.y, rect.width, rect.height).fill(rect.fill)
    //     })

    //     gh.rect(rect.x, rect.y, rect.width, rect.height).fill(randomColor()).stroke('red')
    //   }

    //   g.addChild(rectItem)

    //   return gh
    // })

    // app.stage.addChild(g)

    // {
    //   let count = 0
    //   // Let's create a moving shape
    //   const thing = new Graphics()
    //   app.stage.addChild(thing)

    //   // Animate the moving shape
    //   app.ticker.add(() => {
    //     count += 1

    //     thing.clear()

    //     thing.rect(count, 100, 100, 100).fill(randomColor())

    //     // thing
    //     //   .moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20)
    //     //   .lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20)
    //     //   .lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20)
    //     //   .lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20)
    //     //   .lineTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20)
    //     //   .fill({ color: 0xffff00, alpha: 0.5 })
    //     //   .stroke({ width: 10, color: 0xff0000 })

    //     // thing.rotation = count * 0.1
    //   })
    // }

    // const path_main = new GraphicsPath(
    //   'M4.99989 13.9999L4.99976 5L6.99976 4.99997L6.99986 11.9999L17.1717 12L13.222 8.05024L14.6362 6.63603L21.0001 13L14.6362 19.364L13.222 17.9497L17.1717 14L4.99989 13.9999Z'
    // )
    // const pathShape = gh.path(path_main).fill('pink')
    // app.stage.addChild(pathShape)

    // const basicText = new Text({ text: 'Basic text in pixi' })
    // basicText.x = 50
    // basicText.y = 100

    // basicText.eventMode = 'static'
    // basicText.cursor = 'pointer'

    // basicText.onclick = () => {
    //   basicText.text = randomColor()
    // }

    // app.stage.addChild(basicText)

    // // Load the bunny texture
    // const texture = await Assets.load(logoJpg)
    // const bunny = new Sprite(texture)

    // bunny.eventMode = 'static'
    // bunny.cursor = 'move'

    // // Center the sprite's anchor point
    // bunny.anchor.set(0.5)

    // // Move the sprite to the center of the screen
    // bunny.x = app.screen.width / 2
    // bunny.y = app.screen.height / 2
    // bunny.width = 200
    // bunny.height = 200
    // bunny.alpha = 0.5

    // app.stage.addChild(bunny)
  }

  useEffect(() => {
    // 示例用法

    return
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')

    ctx.clearRect(100, 100, 600, 466)

    const p1 = { x: 100, y: 100 }
    const p2 = { x: 300, y: 400 }

    const angle = Math.atan2(p2.x - p1.x, p2.y - p1.y)

    const tx = Math.cos(Math.PI - angle) * 50
    const ty = Math.sin(Math.PI - angle) * 50

    console.log(tx, ty)

    ctx.arc(tx + p1.x, ty + p1.y, 5, 0, Math.PI * 2)
    ctx.fillStyle = 'red'
    ctx.fill()

    // drawDashedLine(ctx, p1, p2, 10)
    drawDashedLine2(ctx, p1.x, p1.y, p2.x, p2.y, 10)

    ctx.translate(tx, ty)
    drawDashedLine2(ctx, p1.x, p1.y, p2.x, p2.y, 10)

    ctx.beginPath()
    ctx.arc(p1.x, p1.y, 3, 0, Math.PI * 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(p2.x, p2.y, 3, 0, Math.PI * 2)
    ctx.stroke()

    // default centered
    ctx.lineWidth = 10
    ctx.strokeRect(10, 10, 100, 100)

    ctx.lineWidth = 1
    ctx.strokeStyle = 'red'
    ctx.strokeRect(10, 10, 100, 100) // show main path

    // inner
    ctx.rect(150, 10, 100, 100)
    ctx.rect(150 + 10, 10 + 10, 100 - 20, 100 - 20) // offset position and size
    ctx.fill('evenodd') // !important
    ctx.strokeRect(150, 10, 100, 100)
  }, [])

  return (
    <div className="h-full">
      <div className="pixi h-full w-9/12" ref={setContainer} style={{ border: '1px solid #ccc' }}></div>

      {/* <canvas id="myCanvas" width={600} height={600}></canvas> */}

      <svg width={800} height={800}>
        <path
          d="M 274.157882891006,150.71258092125663 L222.37805292125813,148.21562110899958 L219.88109310900109,199.99545107874656 L271.66092307874897,202.4924108910036 Z"
          fill="none"
          stroke="red"
        />
      </svg>
    </div>
  )
}

function drawDashedLine(context: CanvasRenderingContext2D, p1, p2, dashLength) {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y

  const angle = Math.atan2(dy, dx)

  const distance = Math.sqrt(dx * dx + dy * dy)
  console.log(distance)

  const dashCount = distance / (dashLength * 2)
  const dxDash = dx / dashCount
  const dyDash = dy / dashCount

  context.beginPath()
  let prevDistance = 0
  for (let i = 0; i < dashCount; i++) {
    console.log(dashLength * 2 * i)

    const start = dashLength * 2 * i
    const end = dashLength * 2 * i + dashLength * 2
    console.log(start, end)

    const startX = p1.x + dxDash * i * 2
    const startY = p1.y + dyDash * i * 2
    const endX = p1.x + dxDash * (i * 2 + 1)
    const endY = p1.y + dyDash * (i * 2 + 1)

    context.moveTo(startX, startY)
    context.lineTo(endX, endY)

    prevDistance += dashLength * 2
  }
  context.stroke()
}

function drawDashedLine2(context, x1, y1, x2, y2, dashLength) {
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.hypot(dx, dy)

  if (length === 0) return // 两个点重合，无需绘制

  const unitX = dx / length
  const unitY = dy / length

  let currentX = x1
  let currentY = y1
  let currentPosition = 0

  context.beginPath()

  while (currentPosition < length) {
    // 绘制线段部分
    const draw = Math.min(dashLength, length - currentPosition)
    const endX = currentX + unitX * draw
    const endY = currentY + unitY * draw
    context.moveTo(currentX, currentY)
    context.lineTo(endX, endY)
    // 更新当前位置到线段终点
    currentX = endX
    currentY = endY
    currentPosition += draw

    // 跳过间隙部分
    const skip = Math.min(dashLength, length - currentPosition)
    currentX += unitX * skip
    currentY += unitY * skip
    currentPosition += skip
  }

  context.stroke()
}

function calculateNormalAngle(vx, vy) {
  // 计算法向量（逆时针旋转90度）
  const nx = -vy
  const ny = vx

  // 计算法向量的角度（弧度）
  const angleRadians = Math.atan2(ny, nx)

  return angleRadians
}
