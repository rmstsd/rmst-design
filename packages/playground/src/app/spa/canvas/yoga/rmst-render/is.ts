import type { TextNode } from './TextNode'
import type { ViewNode } from './ViewNode'

import { NodeType } from './constant'

export function isTextNode(node): node is TextNode {
  return node.nodeType === NodeType.TextNode
}

export function isViewNode(node): node is ViewNode {
  return node.nodeType === NodeType.ViewNode
}
