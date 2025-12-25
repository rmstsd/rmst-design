import clsx from 'clsx'
import { Fragment, PointerEvent, useRef } from 'react'
import { IConfig, isTabsNode, Total_Grow } from './config'
import { startDrag } from '../_util/drag'
import { clamp } from 'es-toolkit'
import { Tabs } from './Tabs'
import { useLd } from './context'

interface ItemProps {
  config: IConfig
  parentConfig?: IConfig
}

export const Item = ({ config }: ItemProps) => {
  const { ldStore } = useLd()

  const { mode, children = [] } = config

  const containerRef = useRef<HTMLDivElement>(null)

  if (isTabsNode(config)) {
    return <Tabs config={config} />
  }

  const onPointerDown = (downEvt: PointerEvent, index: number) => {
    downEvt.preventDefault()

    const { mode } = config

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()

    const prev = config.children[index - 1]
    const next = config.children[index]

    let downSnap = { prev: prev.style.flexGrow, next: next.style.flexGrow }

    const min = 0.001
    const max = downSnap.next + downSnap.prev

    startDrag(downEvt, {
      onDragMove: moveEvt => {
        let distance = 0
        let size = 0

        if (mode === 'row') {
          distance = moveEvt.clientX - downEvt.clientX
          size = containerRect.width
        } else if (mode === 'column') {
          distance = moveEvt.clientY - downEvt.clientY
          size = containerRect.height
        }

        const delta = (distance / size) * Total_Grow

        prev.style.flexGrow = clamp(downSnap.prev + delta, min, max)
        next.style.flexGrow = clamp(downSnap.next - delta, min, max)

        ldStore.onLayoutChange()
      }
    })
  }

  const { over } = ldStore
  const isOverRoot = over?.type === 'root'

  return (
    <div
      className={clsx('node-item', `${mode}-size-0`, mode, {
        'node-item-root': config.isRoot
      })}
      data-id={config.id}
      data-is-root={config.isRoot}
      style={{ flexGrow: config.style?.flexGrow }}
      ref={containerRef}
    >
      {children.map((childConfig, index) => (
        <Fragment key={index}>
          {index !== 0 && (
            <div
              className="node-item-divider"
              onPointerDown={evt => onPointerDown(evt, index)}
              style={{ cursor: mode === 'row' ? 'ew-resize' : 'ns-resize' }}
            >
              <div className="line"></div>
            </div>
          )}
          <Item config={childConfig} />
        </Fragment>
      ))}

      {config.isRoot && ldStore.source && over && (
        <div data-root-indicator>
          <div className={clsx('root-indicator top', { active: isOverRoot && over.indicator === 'top' })}></div>
          <div className={clsx('root-indicator right', { active: isOverRoot && over.indicator === 'right' })}></div>
          <div className={clsx('root-indicator bottom', { active: isOverRoot && over.indicator === 'bottom' })}></div>
          <div className={clsx('root-indicator left', { active: isOverRoot && over.indicator === 'left' })}></div>
        </div>
      )}
    </div>
  )
}
