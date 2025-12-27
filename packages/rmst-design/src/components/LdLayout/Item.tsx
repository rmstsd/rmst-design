import clsx from 'clsx'
import { Fragment, PointerEvent, useRef } from 'react'
import { findNodeById, IConfig, isTabsNode, LayoutNode, Total_Grow } from './config'
import { startDrag } from '../_util/drag'
import { clamp, cloneDeep } from 'es-toolkit'
import { Tabs } from './Tabs'
import { useLd } from './context'

interface ItemProps {
  config: IConfig
  configIndex?: number
  parentConfig?: IConfig
}

export const Item = (props: ItemProps) => {
  const { config, configIndex, parentConfig } = props
  const isLastConfigIndex = parentConfig && configIndex === parentConfig.children.length - 1

  const { mode, children = [] } = config

  const { ldStore } = useLd()

  if (isTabsNode(config)) {
    return <Tabs config={config} />
  }

  const onPointerDown = (downEvt: PointerEvent, index: number) => {
    downEvt.preventDefault()

    const { mode } = config

    const container = document.querySelector('.rmst-ld-layout')
    const containerRect = container.getBoundingClientRect()

    const prev = config.children[index - 1]
    const next = config.children[index]

    let downSnap = { prev: prev.style.flexGrow, next: next.style.flexGrow }

    const min = 0.000000001
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

  const onPointerDownV2 = (downEvt: PointerEvent, activeLines: string[]) => {
    downEvt.preventDefault()

    const downSnap = {} as Record<string, any>
    activeLines.forEach(item => {
      const [configId, index] = item.split('::')
      const indexNumber = Number(index)

      const config = findNodeById(configId, ldStore.layout).config as LayoutNode

      const prev = config.children[indexNumber - 1]
      const next = config.children[indexNumber]

      downSnap[item] = {
        config,
        prevNode: prev,
        nextNode: next,
        prevFlexGrow: prev.style.flexGrow,
        nextFlexGrow: next.style.flexGrow
      }
    })

    startDrag(downEvt, {
      distanceThreshold: 4,
      onDragMove: moveEvt => {
        let distance = 0
        let size = 0

        Object.values(downSnap).forEach(item => {
          const { config, prevNode, nextNode, prevFlexGrow, nextFlexGrow } = item
          const { mode } = config

          const container = document.querySelector(`[data-id="${config.id}"]`)
          const containerRect = container.getBoundingClientRect()

          const min = 0.000001
          const max = nextFlexGrow + prevFlexGrow

          if (mode === 'row') {
            distance = moveEvt.clientX - downEvt.clientX
            size = containerRect.width
          } else if (mode === 'column') {
            distance = moveEvt.clientY - downEvt.clientY
            size = containerRect.height
          }

          const delta = (distance / size) * Total_Grow

          prevNode.style.flexGrow = clamp(prevFlexGrow + delta, min, max)
          nextNode.style.flexGrow = clamp(nextFlexGrow - delta, min, max)
        })

        ldStore.validate()

        ldStore.onLayoutChange()
      }
    })
  }

  const { over } = ldStore
  const isOverRoot = over?.type === 'root'

  return (
    <div
      className={clsx('node-item', mode, { 'node-item-root': config.isRoot })}
      data-id={config.id}
      data-is-root={config.isRoot}
      style={{ flexGrow: config.style?.flexGrow }}
    >
      {children.map((childConfig, index) => {
        const lineId = `${config.id}::${index}`

        return (
          <Fragment key={index}>
            {index !== 0 && (
              <div className="node-item-divider">
                <div
                  className={clsx('line', { active: ldStore.activeLines.includes(lineId) })}
                  style={{ cursor: mode === 'row' ? 'ew-resize' : 'ns-resize' }}
                  onPointerEnter={() => {
                    ldStore.activeLines = [lineId]
                    ldStore.onLayoutChange()
                  }}
                  onPointerLeave={() => {
                    ldStore.activeLines = []
                    ldStore.onLayoutChange()
                  }}
                  onPointerDown={evt => onPointerDownV2(evt, cloneDeep(ldStore.activeLines))}
                ></div>

                {!config.isRoot && (
                  <>
                    {configIndex !== 0 && (
                      <div
                        className={clsx('multi-handel', mode === 'row' ? 'top' : 'left')}
                        onPointerEnter={() => {
                          const parentLineId = `${parentConfig.id}::${configIndex}`
                          ldStore.activeLines = [lineId, parentLineId]
                          ldStore.onLayoutChange()
                        }}
                        onPointerLeave={() => {
                          ldStore.activeLines = []
                          ldStore.onLayoutChange()
                        }}
                        onPointerDown={evt => onPointerDownV2(evt, cloneDeep(ldStore.activeLines))}
                      ></div>
                    )}
                    {!isLastConfigIndex && (
                      <div
                        className={clsx('multi-handel', mode === 'row' ? 'bottom' : 'right')}
                        onPointerEnter={() => {
                          const parentLineId = `${parentConfig.id}::${configIndex + 1}`
                          ldStore.activeLines = [lineId, parentLineId]
                          ldStore.onLayoutChange()
                        }}
                        onPointerLeave={() => {
                          ldStore.activeLines = []
                          ldStore.onLayoutChange()
                        }}
                        onPointerDown={evt => onPointerDownV2(evt, cloneDeep(ldStore.activeLines))}
                      ></div>
                    )}
                  </>
                )}
              </div>
            )}
            <Item config={childConfig} configIndex={index} parentConfig={config} />
          </Fragment>
        )
      })}

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
