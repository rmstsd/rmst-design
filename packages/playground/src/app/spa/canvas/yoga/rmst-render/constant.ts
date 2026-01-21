import type { Node } from 'yoga-layout'

import { Edge, FlexDirection, Gutter } from 'yoga-layout'

import { applyStyle } from './FlexStyle'

export enum NodeType {
  TextNode,
  ViewNode
}

export type Layout = {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
}

export function setYogaNodeLayoutStyle(yogaNode: Node, style) {
  applyStyle(yogaNode, style)

  return

  if (style.paddingTop) {
    yogaNode.setPadding(Edge.Top, style.paddingTop as number)
  }
  if (style.paddingLeft) {
    yogaNode.setPadding(Edge.Left, style.paddingLeft as number)
  }
  if (style.paddingRight) {
    yogaNode.setPadding(Edge.Right, style.paddingRight as number)
  }
  if (style.paddingBottom) {
    yogaNode.setPadding(Edge.Bottom, style.paddingBottom as number)
  }

  if (style.marginTop) {
    yogaNode.setMargin(Edge.Top, style.marginTop as number)
  }
  if (style.marginLeft) {
    yogaNode.setMargin(Edge.Left, style.marginLeft as number)
  }
  if (style.marginBottom) {
    yogaNode.setMargin(Edge.Bottom, style.marginBottom as number)
  }
  if (style.marginRight) {
    yogaNode.setMargin(Edge.Right, style.marginRight as number)
  }

  if (style.width) {
    yogaNode.setWidth(style.width as number)
  }
  if (style.height) {
    yogaNode.setHeight(style.height as number)
  }

  if (style.flexDirection) {
    // import camelCase from 'camelcase'
    // camelCase('Foo-Bar', { pascalCase: true }); => 'FooBar'
    // const cc = camelCase(style.flexDirection, { pascalCase: true })
    // yogaNode.setFlexDirection(FlexDirection[cc])
  }
  if (style.gap) {
    yogaNode.setGap(Gutter.All, style.gap as number)
  }
}
