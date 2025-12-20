import clsx from 'clsx'
import { Fragment, PointerEvent, useRef } from 'react'
import { IConfig, Total_Grow } from './config'
import { observer } from 'mobx-react-lite'
import { startDrag } from '../_util/drag'
import { clamp } from 'es-toolkit'
import { Tabs } from './Tabs'

interface ItemProps {
  config: IConfig
  parentConfig?: IConfig
}

export const Item = observer(({ config }: ItemProps) => {
  const { mode, children = [] } = config

  const containerRef = useRef<HTMLDivElement>(null)

  if (mode === 'tabs') {
    return <Tabs config={config as any} />
  }

  const onPointerDown = (downEvt: PointerEvent, childConfig: IConfig, index: number) => {
    downEvt.preventDefault()

    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()

    const prev = children[index - 1]
    const next = children[index]

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
      }
    })
  }

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
              onPointerDown={evt => onPointerDown(evt, childConfig, index)}
              style={{ cursor: mode === 'row' ? 'ew-resize' : 'ns-resize' }}
            >
              <div className="line"></div>
            </div>
          )}
          <Item config={childConfig} />
        </Fragment>
      ))}

      <div data-root-indicator>
        <div className="root-indicator top"></div>
        <div className="root-indicator right"></div>
        <div className="root-indicator bottom"></div>
        <div className="root-indicator left"></div>
      </div>
    </div>
  )
})
