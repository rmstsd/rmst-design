import { startDrag } from 'node_modules/rmst-design/src/components/_util/drag'

class Rect {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public fillStyle: string
  ) {}
}

export class Stage {
  container: HTMLElement
  canvas: HTMLCanvasElement

  rects: Rect[] = []

  dpr = window.devicePixelRatio

  abCt: AbortController

  rootMt = {
    tx: 0,
    ty: 0,
    scale: 1
  }

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
    this.abCt = new AbortController()

    this.updateSize()

    const width = 10
    const height = 20

    const padding = 5

    this.rects = Array.from(
      { length: 1_0000 },
      () =>
        new Rect(
          padding + Math.random() * (this.canvas.width - width - padding * 2),
          padding + Math.random() * (this.canvas.height - height - padding * 2),
          width,
          height,
          `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
        )
    )

    this.canvas.addEventListener(
      'pointerdown',
      downEvt => {
        downEvt.preventDefault()
        let downMt = { ...this.rootMt }

        startDrag(downEvt, {
          onDragMove: moveEvt => {
            let dx = moveEvt.clientX - downEvt.clientX
            let dy = moveEvt.clientY - downEvt.clientY
            this.rootMt.tx = downMt.tx + dx
            this.rootMt.ty = downMt.ty + dy

            this.draw()
          }
        })
      },
      { signal: this.abCt.signal }
    )

    this.canvas.addEventListener(
      'wheel',
      evt => {
        evt.preventDefault()
      },
      { signal: this.abCt.signal }
    )
  }

  updateSize() {
    const { canvas, container } = this
    canvas.width = container.clientWidth * this.dpr
    canvas.height = container.clientHeight * this.dpr
    canvas.style.width = `${container.clientWidth}px`
    canvas.style.height = `${container.clientHeight}px`
  }

  imageBitmap: ImageBitmap

  offscreenCanvas() {
    const { canvas } = this
    const offscreen = new OffscreenCanvas(canvas.width, canvas.height)
    const ctx = offscreen.getContext('2d')

    ctx.resetTransform()
    ctx.clearRect(0, 0, offscreen.width, offscreen.height)

    ctx.scale(this.dpr, this.dpr)

    ctx.translate(this.rootMt.tx, this.rootMt.ty)
    ctx.scale(this.rootMt.scale, this.rootMt.scale)

    this.rects.forEach(rect => {
      ctx.beginPath()

      ctx.fillStyle = rect.fillStyle
      ctx.rect(rect.x, rect.y, rect.width, rect.height)

      ctx.fill()
    })

    this.imageBitmap = offscreen.transferToImageBitmap()
  }

  draw() {
    const ctx = this.canvas.getContext('2d')!
    ctx.resetTransform()

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (!this.imageBitmap) {
      this.offscreenCanvas()
    }

    // ctx.scale(this.dpr, this.dpr)

    // ctx.translate(this.rootMt.tx * this.dpr, this.rootMt.ty * this.dpr)
    ctx.translate(this.rootMt.tx, this.rootMt.ty)
    ctx.scale(this.rootMt.scale, this.rootMt.scale)

    ctx.drawImage(this.imageBitmap, 0, 0)

    return
    this.rects.forEach(rect => {
      ctx.beginPath()

      ctx.fillStyle = rect.fillStyle
      ctx.rect(rect.x, rect.y, rect.width, rect.height)

      ctx.fill()
    })
  }

  clear() {
    const ctx = this.canvas.getContext('2d')!
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
