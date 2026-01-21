import type { NodeItem } from './oriData'

export function findParentNode(id: NodeItem['id'], node: NodeItem): NodeItem {
  return dfs(node)

  function dfs(node: NodeItem, parent = null) {
    if (id === node.id) {
      return parent
    }

    for (const item of node.children ?? []) {
      const res = dfs(item, node)
      if (res) {
        return res
      }
    }
  }
}

export function findNode(id: NodeItem['id'], node: NodeItem): NodeItem {
  return dfs(node)

  function dfs(node: NodeItem) {
    if (id === node.id) {
      return node
    }

    for (const item of node.children ?? []) {
      const res = dfs(item)
      if (res) {
        return res
      }
    }
  }
}

// 判断 bNode 是否是 aNode 的后代
export function isDescendant(aNode: NodeItem, bNode: NodeItem) {
  if (aNode.id === bNode.id) {
    return false
  }

  return dfs(aNode)

  function dfs(_node: NodeItem) {
    if (_node.id === bNode.id) {
      return true
    }

    for (const item of _node.children) {
      const b = dfs(item)
      if (b) {
        return true
      }
    }
  }
}

// 判断 bNode 是否是 aNode 的子孙, 包含相等
export function contains(aNode: NodeItem, bNode: NodeItem) {
  return dfs(aNode)

  function dfs(_node: NodeItem) {
    if (_node.id === bNode.id) {
      return true
    }

    for (const item of _node.children) {
      const b = dfs(item)
      if (b) {
        return true
      }
    }
  }
}

export function uuId() {
  return Math.random().toString(36).slice(4)
}
