export { unstable_now as now, unstable_IdlePriority as idlePriority, unstable_runWithPriority as run } from 'scheduler'
import { DefaultEventPriority } from 'react-reconciler/constants.js'

import { TextNode, ViewNode } from '../rmst-render'
import { NodeType } from '../rmst-render/constant'

const NO_CONTEXT = {}
const UPDATE_SIGNAL = {}

export function appendInitialChild(parentInstance, child) {
  if (parentInstance.nodeType === NodeType.TextNode) {
    return
  }
  parentInstance.append(child)
}

export function createInstance(type, props, internalInstanceHandle) {
  let NodeClass

  switch (type) {
    case 'RmstText': {
      NodeClass = TextNode
      break
    }
    case 'RmstView': {
      NodeClass = ViewNode
      break
    }
  }

  const args = type === 'RmstText' ? [props.children, props.style] : [props.style]

  const instance = new NodeClass(...args)

  return instance
}

export function createTextInstance(text, rootContainerInstance, internalInstanceHandle) {}

export function finalizeInitialChildren(domElement, type, props) {
  return false
}

export function getPublicInstance(instance) {
  return instance
}

export function prepareForCommit() {
  return null
}

export function preparePortalMount() {
  return null
}

export function prepareUpdate(domElement, type, oldProps, newProps) {
  return UPDATE_SIGNAL
}

export function resetAfterCommit() {
  // Noop
}

export function resetTextContent(domElement) {
  // Noop
}

export function shouldDeprioritizeSubtree(type, props) {
  return false
}

export function getRootHostContext() {
  return NO_CONTEXT
}

export function getChildHostContext() {
  return NO_CONTEXT
}

export const scheduleTimeout = setTimeout
export const cancelTimeout = clearTimeout
export const noTimeout = -1
// export const schedulePassiveEffects = scheduleDeferredCallback;
// export const cancelPassiveEffects = cancelDeferredCallback;

export function shouldSetTextContent(type, props) {
  return false
}

// The Konva renderer is secondary to the React DOM renderer.
export const isPrimaryRenderer = false
export const warnsIfNotActing = true
export const supportsMutation = true

export function appendChild(parentInstance, child) {
  if (child.parent === parentInstance) {
    child.moveToTop()
  } else {
    parentInstance.add(child)
  }
}

export function appendChildToContainer(parentInstance, child) {
  if (child.parent === parentInstance) {
    child.moveToTop()
  } else {
    parentInstance.append(child)
  }
}

export function insertBefore(parentInstance, child, beforeChild) {
  // child._remove() will not stop dragging
  // but child.remove() will stop it, but we don't need it
  // removing will reset zIndexes
  child._remove()
  parentInstance.add(child)
  child.setZIndex(beforeChild.getZIndex())
}

export function insertInContainerBefore(parentInstance, child, beforeChild) {
  insertBefore(parentInstance, child, beforeChild)
}

export function removeChild(parentInstance, child) {}

export function removeChildFromContainer(parentInstance, child) {}

export function commitTextUpdate(textInstance, oldText, newText) {
  console.error(`Text components are not yet supported in ReactKonva. You text is: "${newText}"`)
}

export function commitMount(instance, type, newProps) {
  // Noop
}

export function commitUpdate(instance, updatePayload, type, oldProps, newProps) {}

export function hideInstance(instance) {
  instance.hide()
}

export function hideTextInstance(textInstance) {
  // Noop
}

export function unhideInstance(instance, props) {
  if (props.visible == null || props.visible) {
    instance.show()
  }
}

export function unhideTextInstance(textInstance, text) {
  // Noop
}

export function clearContainer(container) {
  // Noop
}

export function detachDeletedInstance() {}

export const getCurrentEventPriority = () => DefaultEventPriority
