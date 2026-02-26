'use client'

import { Fragment, PointerEvent, useEffectEvent, useRef, useState, ViewTransition } from 'react'

import './child.scss'
import { startDrag } from 'rmst-design'
import { clamp, isNil } from 'es-toolkit'

export default function Child() {
  const [widths, setWidths] = useState([20, 20, 20, 20, 20])

  const widthsRef = useRef(widths)
  widthsRef.current = widths

  const validate = useEffectEvent(() => {
    const total = widths.reduce((acc, item) => acc + item, 0)

    if (total !== 100) {
      console.log('error')
    }
  })

  const onPointerDown = (downEvt: PointerEvent, downIndex: number) => {
    console.log(downIndex)
    downEvt.preventDefault()

    const container = document.querySelector('.att-container') as HTMLDivElement
    const containerRect = container.getBoundingClientRect()

    const Min_Width = 5

    let initWidth = [...widths]

    startDrag(downEvt, {
      onDragMove: moveEvt => {
        const newWidths = [...initWidth]

        if (moveEvt.clientX < downEvt.clientX) {
          let dPx = Math.abs(moveEvt.clientX - downEvt.clientX)
          let dRatio = (dPx / containerRect.width) * 100

          // 总的可压缩的
          let totalCanShrink = 0
          for (let index = 0; index <= downIndex; index++) {
            totalCanShrink += newWidths[index] - Min_Width
          }
          dRatio = Math.min(dRatio, totalCanShrink)

          let toShrink = dRatio
          for (let index = downIndex; index >= 0; index--) {
            const currentDis = newWidths[index] - Min_Width // 当前列能缩减的的最大值
            const amount = Math.min(toShrink, currentDis)

            newWidths[index] -= amount
            toShrink -= amount
          }

          newWidths[downIndex + 1] += dRatio

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
