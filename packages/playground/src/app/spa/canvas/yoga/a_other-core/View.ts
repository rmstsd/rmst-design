import type { IViewLayout, IViewStyle } from './interface'
import type Layer from './Layer'
import type Text from './Text'

import Node from './Node'

export default class View extends Node {
  layer!: Layer
  layout = {} as IViewLayout
  type = 'View' as const
  children: (View | Text)[] = []

  constructor(protected style: IViewStyle) {
    super(style)
  }

  // 更新属性
  update(nextProps?: Partial<IViewStyle>) {
    this.style = { ...this.style, ...nextProps }
    const layer = this.getLayer()
    layer?.batchDraw()
  }

  // 开始布局（包括遍历子节点布局）
  handleSetLayout() {
    this.setLayout()
    this.children.forEach(child => child.handleSetLayout())
  }

  // 开始重绘
  draw() {
    this.calcLayout()
    this.drawCanvas()
  }

  // 绘制 canvas
  drawCanvas() {
    const ctx = this.layer.context
    ctx.beginPath()
    ctx.fillStyle = this.layout.fillStyle
    ctx.fillRect(this.layout.x, this.layout.y, this.layout.width, this.layout.height)
    ctx.stroke()
    this.children.forEach(child => child.draw())
  }

  add(child: View | Text) {
    child.parent = this
    child.layer = this.layer
    this.children.push(child)
    this.node.insertChild(child.node, this.children.length - 1)
    child.update()
  }

  getLayer() {
    return this.layer
  }
}
