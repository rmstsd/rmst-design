import type React from 'react'
import type { Node } from 'yoga-layout'

import Yoga, { Edge } from 'yoga-layout'

import type { Layout } from './constant'

import { NodeType, setYogaNodeLayoutStyle } from './constant'

function measureText(ctx, text) {
  const metrics = ctx.measureText(text)
  const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent || parseInt(ctx.font)
  const textWidth = metrics.width

  return { textWidth, textHeight }
}

export class TextNode {
  constructor(content: string, style?: React.CSSProperties & { color: string }) {
    this.yogaNode = Yoga.Node.create()
    this.content = content
    this.style = style

    setYogaNodeLayoutStyle(this.yogaNode, style)
  }

  yogaNode: Node

  style: React.CSSProperties = {}
  nodeType = NodeType.TextNode

  content: string

  layout: Layout

  setText(ctx: CanvasRenderingContext2D) {
    const { textWidth, textHeight } = measureText(ctx, this.content)

    const paddingAll = this.yogaNode.getPadding(Edge.All).value || 0

    const paddingLeft = this.yogaNode.getPadding(Edge.Left).value || 0 || paddingAll
    const paddingTop = this.yogaNode.getPadding(Edge.Top).value || 0 || paddingAll
    const paddingRight = this.yogaNode.getPadding(Edge.Right).value || 0 || paddingAll
    const paddingBottom = this.yogaNode.getPadding(Edge.Bottom).value || 0 || paddingAll

    setYogaNodeLayoutStyle(this.yogaNode, {
      width: textWidth + paddingLeft + paddingRight,
      height: textHeight + paddingTop + paddingBottom
    })
  }

  setLayout() {
    this.layout = this.yogaNode.getComputedLayout()
  }
}
