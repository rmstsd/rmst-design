import type { Node } from 'yoga-layout'

import Yoga from 'yoga-layout'

import type { ILayerProps } from './interface'
import type Stage from './Stage'
import type Text from './Text'
import type View from './View'

export default class Layer {
  children: (View | Text)[] = []
  parent?: Stage
  canvas!: HTMLCanvasElement
  context!: CanvasRenderingContext2D
  node!: Node
  isBatching = false
  layout = { x: 0, y: 0 }

  constructor(private style: ILayerProps) {
    this.initDOM()
    this.initYoga()
    ;(window as any).layerNode = this.node
  }

  // 初始化 canvas
  initDOM() {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    this.canvas.width = this.style.width
    this.canvas.height = this.style.height
  }

  initYoga() {
    this.node = Yoga.Node.create()
    this.node.setWidth(this.style.width)
    this.node.setHeight(this.style.height)
  }

  // 添加子节点
  add(child: View | Text) {
    child.layer = this
    this.children.push(child)
    this.node.insertChild(child.node, this.children.length - 1)
    // 添加子节点后批量更新
    this.batchDraw()
  }

  // 批量更新
  batchDraw() {
    if (!this.isBatching) {
      this.isBatching = true
      window.requestAnimationFrame(() => {
        this.context.clearRect(0, 0, this.style.width, this.style.height)
        this.setLayout()
        this.draw()
        this.isBatching = false
      })
    }
  }

  setLayout() {
    this.children.forEach(child => child.handleSetLayout())
    this.node.calculateLayout(Yoga.UNIT_UNDEFINED, Yoga.UNIT_UNDEFINED, Yoga.DIRECTION_LTR)
  }

  // 遍历子节点更新
  draw() {
    this.children.forEach(child => child.draw())
  }

  getLayer() {
    return this
  }
}
