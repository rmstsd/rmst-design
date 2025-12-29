'use client'

import { Fragment, PointerEvent, useEffectEvent, useState, ViewTransition } from 'react'

import './child.scss'
import { startDrag } from '../../../../../rmst-design/src/components/_util/drag'
import { clamp } from 'es-toolkit'

export default function Child() {
  const [widths, setWidths] = useState([20, 20, 20, 20, 20])

  const validate = useEffectEvent(() => {
    const total = widths.reduce((acc, item) => acc + item, 0)

    if (total !== 100) {
      console.log('error')
    }
  })

  const onPointerDown = (downEvt: PointerEvent, index: number) => {
    console.log(index)
    downEvt.preventDefault()

    const container = document.querySelector('.att-container') as HTMLDivElement
    const containerRect = container.getBoundingClientRect()

    const total = 100
    const min = 5
    const snapWidths = [...widths]

    startDrag(downEvt, {
      onDragMove: moveEvt => {
        if (moveEvt.clientX < downEvt.clientX) {
          let distance = Math.abs(moveEvt.clientX - downEvt.clientX)
          let delta = (distance / containerRect.width) * total

          const newWidths = [...snapWidths]

          let availableLeftShrink = 0
          for (let i = index; i >= 0; i--) {
            availableLeftShrink += Math.max(0, newWidths[i] - min)
          }
          const actualDelta = Math.min(delta, availableLeftShrink)

          // 2. Shrink left columns cascadingly (starting from immediate left neighbor)
          let toShrink = actualDelta
          for (let i = index; i >= 0 && toShrink > 0; i--) {
            const currentShrink = Math.min(toShrink, newWidths[i] - min)
            newWidths[i] -= currentShrink
            toShrink -= currentShrink
          }

          // newWidths[index] -= actualDelta
          newWidths[index + 1] += actualDelta

          if (newWidths[index] < 0) {
            newWidths[index] = 0
          }

          setWidths(newWidths)

          validate()
        }
      }
    })
  }

  return (
    <div className="p-10">
      <div className="att-container flex items-center border">
        {widths.map((item, index) => (
          <Fragment key={index}>
            <div className="p-1 shrink-0 min-w-0 w-0" style={{ flexGrow: item }}>
              {item.toFixed(2)}
            </div>

            {index !== widths.length - 1 && (
              <div
                className="shrink-0 bg-amber-400 cursor-w-resize w-1 self-stretch"
                onPointerDown={evt => onPointerDown(evt, index)}
              ></div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
