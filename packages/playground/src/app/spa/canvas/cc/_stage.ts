import { startDrag } from 'rmst-design'
import { compose, identity, scale, translate } from 'transformation-matrix'
import { Rect } from './Rect'
import { create } from './util'
import { cloneDeep } from 'es-toolkit'

export class Stage {
  dpr = window.devicePixelRatio
  abCt: AbortController

  container: HTMLElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  offscreenCanvas: OffscreenCanvas
  oCtx: OffscreenCanvasRenderingContext2D
  imageBitmap: ImageBitmap

  rects: Rect[] = []

  rootMt = identity() //

  mainMt = identity() // 主变换矩阵 用于平移

  constructor() {}

  dispose() {
    this.canvas.remove()
    this.abCt.abort()
  }

  init(container) {
    this.container = container
    const canvas = document.createElement('canvas')
    container.appendChild(canvas)
    canvas.style.position = 'absolute'
    canvas.style.left = '0'
    canvas.style.top = '0'

    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.abCt = new AbortController()

    this.updateMainCanvasSize()

    this.offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height)
    this.oCtx = this.offscreenCanvas.getContext('2d')

    const width = 10
    const height = 20

    const padding = 5

    // 所有矩形有规律的分布在 canvas 中, 不要重叠
    const rects = create(5)

    this.rects = rects.map(item => new Rect(item.x, item.y, item.width, item.height, item.color))

    // this.rects = Array.from(
    //   { length: 5_0000 },
    //   () =>
    //     new Rect(
    //       padding + Math.random() * (this.canvas.clientWidth - width - padding * 2),
    //       padding + Math.random() * (this.canvas.clientHeight - height - padding * 2),
    //       width,
    //       height,
    //       `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
    //     )
    // )

    this.canvas.addEventListener(
      'pointerdown',
      downEvt => {
        downEvt.preventDefault()
        let downMt = cloneDeep(this.mainMt)

        const downPos = {
          x: downEvt.clientX * this.dpr,
          y: downEvt.clientY * this.dpr
        }

        startDrag(downEvt, {
          onDragMove: moveEvt => {
            const movePos = {
              x: moveEvt.clientX * this.dpr,
              y: moveEvt.clientY * this.dpr
            }

            let dx = movePos.x - downPos.x
            let dy = movePos.y - downPos.y

            // this.rootMt = compose(translate(dx, dy), downMt)
            this.mainMt = compose(translate(dx, dy), downMt)

            this.drawMainCanvas()
          }
        })
      },
      { signal: this.abCt.signal }
    )

    this.canvas.addEventListener(
      'wheel',
      evt => {
        evt.preventDefault()
        return

        let newScale = this.rootMt.scale * (evt.deltaY > 0 ? 0.8 : 1.2)
        newScale = Math.max(0.1, Math.min(9, newScale))

        this.rootMt.scale = newScale

        this.drawMainCanvas()
      },
      { signal: this.abCt.signal }
    )
  }

  updateMainCanvasSize() {
    const { canvas, container } = this
    canvas.width = container.clientWidth * this.dpr
    canvas.height = container.clientHeight * this.dpr
    canvas.style.width = `${container.clientWidth}px`
    canvas.style.height = `${container.clientHeight}px`
  }

  drawOffscreenCanvas() {
    const offscreen = this.offscreenCanvas
    const ctx = this.oCtx

    ctx.resetTransform()
    ctx.clearRect(0, 0, offscreen.width, offscreen.height)

    ctx.scale(this.dpr, this.dpr)

    const mt = this.rootMt
    ctx.transform(mt.a, mt.b, mt.c, mt.d, mt.e, mt.f)

    this.rects.forEach(rect => {
      ctx.beginPath()

      ctx.fillStyle = rect.fillStyle
      ctx.rect(rect.x, rect.y, rect.width, rect.height)

      ctx.fill()
    })
  }

  drawMainCanvas() {
    const ctx = this.ctx
    ctx.resetTransform()

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.setTransform(this.mainMt)

    // if (!this.imageBitmap) {
    // this.drawOffscreenCanvas()
    // }

    ctx.drawImage(this.offscreenCanvas, 0, 0)
  }

  clear() {
    const ctx = this.ctx
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  updateColor() {
    this.rects.forEach(rect => {
      rect.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
    })

    this.multiBatchDraw()
  }

  multiBatchDraw() {
    const rects = this.rects
    const per = 5000
    let start = 0

    const offCtx = this.oCtx

    const renderLoop = () => {
      console.log('renderLoop')
      const end = start + per
      const partRects = rects.slice(start, end)

      start = end

      offCtx.resetTransform()
      offCtx.scale(this.dpr, this.dpr)

      const minX = Math.min(...partRects.map(rect => rect.x))
      const minY = Math.min(...partRects.map(rect => rect.y))
      const maxX = Math.max(...partRects.map(rect => rect.x + rect.width))
      const maxY = Math.max(...partRects.map(rect => rect.y + rect.height))

      offCtx.clearRect(minX, minY, maxX - minX, maxY - minY)

      partRects.forEach(rect => {
        offCtx.beginPath()

        offCtx.fillStyle = rect.fillStyle
        offCtx.rect(rect.x, rect.y, rect.width, rect.height)

        offCtx.fill()
      })

      this.drawMainCanvas()

      if (end >= rects.length) {
        return
      }

      setTimeout(() => {
        renderLoop()
      }, 1000)
    }

    renderLoop()
  }

  zoomIn() {
    this.mainMt.scale *= 1.2
    this.multiBatchDraw()
  }

  zoomOut() {
    this.rootMt.scale *= 0.8
    this.multiBatchDraw()
  }

  zoomToFit() {
    this.rootMt = this.getZoomFitViewportMt()
    // this.multiBatchDraw()
  }

  get viewportSize() {
    return { width: this.canvas.clientWidth, height: this.canvas.clientHeight }
  }

  getZoomFitViewportMt() {
    // const { minX, minY, maxX, maxY } = mergeBox(selRects) // 场景坐标系
    const minX = Math.min(...this.rects.map(rect => rect.x))
    const minY = Math.min(...this.rects.map(rect => rect.y))
    const maxX = Math.max(...this.rects.map(rect => rect.x + rect.width))
    const maxY = Math.max(...this.rects.map(rect => rect.y + rect.height))

    const contentRect = { x: minX, y: minY, width: maxX - minX, height: maxY - minY }

    const viewportSize = this.viewportSize
    const padding = 10
    const viewportRect = {
      x: padding,
      y: padding,
      width: viewportSize.width - padding * 2,
      height: viewportSize.height - padding * 2
    }
    const zoomX = viewportRect.width / contentRect.width
    const zoomY = viewportRect.height / contentRect.height
    const zoom = Math.min(zoomX, zoomY)
    // this.zoom = zoom

    const scaleMt = compose(
      translate(-contentRect.x + viewportRect.x, -contentRect.y + viewportRect.y),
      scale(zoom, zoom, contentRect.x, contentRect.y)
    )

    const tx = (viewportRect.width / zoom - contentRect.width) / 2
    const ty = (viewportRect.height / zoom - contentRect.height) / 2

    const newMt = compose(scaleMt, translate(tx, ty))

    return newMt
  }
}
