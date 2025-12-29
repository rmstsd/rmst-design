import clsx from 'clsx'
import { Fragment, PointerEvent } from 'react'
import { findNodeById, IConfig, isTabsNode, LayoutNode, Total_Grow } from './config'
import { startDrag } from '../_util/drag'
import { cloneDeep } from 'es-toolkit'
import { Tabs } from './Tabs'
import { useLd } from './context'

interface ItemProps {
  config: IConfig
  configIndex?: number
  parentConfig?: IConfig
}

export const Item = (props: ItemProps) => {
  const { config, configIndex, parentConfig } = props
  const { ldStore } = useLd()

  if (isTabsNode(config)) {
    return <Tabs config={config} />
  }

  const { mode, children = [] } = config
  const isLastConfigIndex = parentConfig && configIndex === parentConfig.children.length - 1

  const onPointerDownV2 = (downEvt: PointerEvent, activeLines: string[]) => {
    downEvt.preventDefault()

    const downSnap = {} as Record<string, { config: LayoutNode; indexNumber: number; snapWidths: number[] }>
    activeLines.forEach(item => {
      const [configId, index] = item.split('::')
      const indexNumber = Number(index)
      const config = findNodeById(configId, ldStore.layout).config as LayoutNode
      downSnap[item] = { config, indexNumber: indexNumber, snapWidths: config.children.map(item => item.style.flexGrow) }
    })

    const Min_Width_Grow = 5

    startDrag(downEvt, {
      distanceThreshold: 4,
      onDragMove: moveEvt => {
        Object.values(downSnap).forEach(item => {
          const { config, indexNumber, snapWidths } = item

          const container = document.querySelector(`[data-id="${config.id}"]`)
          const containerRect = container.getBoundingClientRect()

          let isToStart = config.mode === 'row' ? moveEvt.clientX < downEvt.clientX : moveEvt.clientY < downEvt.clientY
          const deltaX = (Math.abs(moveEvt.clientX - downEvt.clientX) / containerRect.width) * Total_Grow
          const deltaY = (Math.abs(moveEvt.clientY - downEvt.clientY) / containerRect.height) * Total_Grow
          const delta = config.mode === 'row' ? deltaX : deltaY

          let newWidths = [...snapWidths]

          let availableShrink = 0
          if (isToStart) {
            availableShrink = newWidths.slice(0, indexNumber).reduce((acc, cur) => acc + (cur - Min_Width_Grow), 0)
          } else {
            availableShrink = newWidths.slice(indexNumber).reduce((acc, cur) => acc + (cur - Min_Width_Grow), 0)
          }

          const actualDelta = Math.min(delta, availableShrink)
          let toShrink = actualDelta

          if (isToStart) {
            for (let i = indexNumber - 1; i >= 0 && toShrink >= 0; i--) {
              const currentShrink = Math.min(toShrink, newWidths[i] - Min_Width_Grow)
              newWidths[i] -= currentShrink
              toShrink -= currentShrink

              config.children[i].style.flexGrow = newWidths[i]
            }

            newWidths[indexNumber] += actualDelta
            config.children[indexNumber].style.flexGrow = newWidths[indexNumber]
          } else {
            for (let i = indexNumber; i < newWidths.length && toShrink >= 0; i++) {
              const currentShrink = Math.min(toShrink, newWidths[i] - Min_Width_Grow)
              newWidths[i] -= currentShrink
              toShrink -= currentShrink

              config.children[i].style.flexGrow = newWidths[i]
            }

            newWidths[indexNumber - 1] += actualDelta
            config.children[indexNumber - 1].style.flexGrow = newWidths[indexNumber - 1]
          }
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
