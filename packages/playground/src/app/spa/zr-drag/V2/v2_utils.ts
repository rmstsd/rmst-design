import { NodeItem } from '../shared/oriData'
import { DataNodeAttrName } from './store/moveHelper'

export interface IPoint {
  x: number
  y: number
}

export function calcDistancePointToEdge(point: IPoint, rect: IRect) {
  const distanceTop = Math.abs(point.y - rect.y)
  const distanceBottom = Math.abs(point.y - (rect.y + rect.height))
  // const distanceLeft = Math.abs(point.x - rect.x)
  // const distanceRight = Math.abs(point.x - (rect.x + rect.width))
  // return Math.min(distanceTop, distanceBottom, distanceLeft, distanceRight)
  return Math.min(distanceTop, distanceBottom)
}

export function isPointInRect(point: IPoint, rect: IRect, sensitive = true) {
  const boundSensor = (value: number) => {
    if (!sensitive) return 0
    const sensor = value * 0.1
    if (sensor > 20) return 20
    if (sensor < 10) return 10
    return sensor
  }

  return (
    point.x >= rect.x + boundSensor(rect.width) &&
    point.x <= rect.x + rect.width - boundSensor(rect.width) &&
    point.y >= rect.y + boundSensor(rect.height) &&
    point.y <= rect.y + rect.height - boundSensor(rect.height)
  )
}

export function isNearAfter(point: IPoint, rect: IRect) {
  return Math.abs(point.y - rect.y) > Math.abs(point.y - (rect.y + rect.height))
}

export function calcDistanceOfPointToRect(point: IPoint, rect: IRect) {
  let minX = Math.min(Math.abs(point.x - rect.x), Math.abs(point.x - (rect.x + rect.width)))
  let minY = Math.min(Math.abs(point.y - rect.y), Math.abs(point.y - (rect.y + rect.height)))
  if (point.x >= rect.x && point.x <= rect.x + rect.width) {
    minX = 0
  }
  if (point.y >= rect.y && point.y <= rect.y + rect.height) {
    minY = 0
  }

  return Math.sqrt(minX ** 2 + minY ** 2)
}

interface IRect {
  x: number
  y: number
  width: number
  height: number
}

export enum ClosestPosition {
  Beforebegin = 'beforebegin', // targetElement 之前。
  Afterend = 'afterend', // targetElement 之后。
  Inner = 'Inner'
}

export function getNodeRectById(nodeId: string) {
  const element = getElementByNodeId(nodeId)
  const rect = element.getBoundingClientRect()

  return rect
}

export function getElementByNodeId(nodeId: string) {
  return document.querySelector(`[${DataNodeAttrName}="${nodeId}"]`)
}

const allowAppendType = ['root', 'if', 'while']

export function allowAppend(node: NodeItem) {
  return allowAppendType.includes(node.type)
}

export const allowDrag = (node: NodeItem) => {
  if (isRootNode(node)) {
    return false
  }

  return true
}

export const isRootNode = (node: NodeItem) => node.type === 'root'
