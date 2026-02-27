'use client'

import { Fragment, PointerEvent, useEffectEvent, useRef, useState, ViewTransition } from 'react'

import './child.scss'
import { startDrag } from 'rmst-design'
import { clamp, cloneDeep, isNil } from 'es-toolkit'

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
    // 总的可压缩的
    let totalCanShrink = 0
    for (let index = 0; index <= downIndex; index++) {
      totalCanShrink += initWidth[index] - Min_Width
    }

    let lastMoveX = ((downEvt.clientX - containerRect.left) / containerRect.width) * 100

    startDrag(downEvt, {
      onDragMove: moveEvt => {
        {
          const newWidths = [...widthsRef.current]

          const deltaX = ((moveEvt.clientX - containerRect.left) / containerRect.width) * 100 - lastMoveX

          let remainingDelta = Math.abs(deltaX)

          let totalConsumed = 0

          if (deltaX === 0) {
            return
          }

          if (deltaX > 0) {
            // 往右
            // Moving Right: Squeeze columns to the right of the handle
            for (let i = downIndex + 1; i < newWidths.length && remainingDelta > 0; i++) {
              const shrinkable = Math.max(0, newWidths[i] - Min_Width)
              const consumed = Math.min(remainingDelta, shrinkable)

              newWidths[i] -= consumed
              remainingDelta -= consumed
              totalConsumed += consumed
            }
            // Expand the column immediately to the left by the amount we actually shrunk on the right
            newWidths[downIndex] += totalConsumed
          } else {
            // 往左
            for (let i = downIndex; i >= 0 && remainingDelta > 0; i--) {
              const shrinkable = newWidths[i] - Min_Width
              const consumed = Math.min(remainingDelta, shrinkable)

              newWidths[i] -= consumed
              remainingDelta -= consumed

              totalConsumed += consumed
            }
            newWidths[downIndex + 1] += totalConsumed
          }

          if (totalConsumed > 0) {
            setWidths(newWidths)

            lastMoveX += deltaX > 0 ? totalConsumed : -totalConsumed
          }
        }

        return

        const newWidths = [...initWidth]

        if (moveEvt.clientX < downEvt.clientX) {
          let dPx = Math.abs(moveEvt.clientX - downEvt.clientX)
          let dRatio = (dPx / containerRect.width) * 100

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
                className="shrink-0 bg-red-500 cursor-w-resize w-1 self-stretch"
                onPointerDown={evt => onPointerDown(evt, index)}
              ></div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
