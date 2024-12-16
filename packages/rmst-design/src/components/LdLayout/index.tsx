import './style.less'
import { config, getComponentByName } from './config'
import { Item } from './Item'
import { useState } from 'react'

const nodeAttrName = 'data-component-id'

export function LdLayout() {
  const [] = useState()

  const onPointerDown = (evt: React.PointerEvent) => {
    evt.preventDefault()

    const target = evt.target as HTMLElement
    const dragTarget = target.closest(`[${nodeAttrName}]`)
    if (!dragTarget) {
      return
    }

    let dropTarget: HTMLElement | null = null

    const comName = dragTarget.getAttribute(nodeAttrName)

    console.log(comName)
    console.log(getComponentByName(comName))

    const onPointerMove = (evt: PointerEvent) => {
      const target = evt.target as HTMLElement
      dropTarget = target.closest(`[${nodeAttrName}]`)

      if (dropTarget) {
        console.log(dropTarget.getAttribute(nodeAttrName))
      }
    }

    const onPointerUp = (evt: PointerEvent) => {
      if (dropTarget === dragTarget) {
        return
      }

      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }

  return (
    <div className="rt-ld-layout" onPointerDown={onPointerDown}>
      <Item config={config} />

      <div className="ghost"></div>
    </div>
  )
}
