'use client'

// https://aistudio.google.com/prompts/1p6y-XQrXVbwcjrUcCE1aWCfx_aqx9Y66

import { useRef, useState } from 'react'
import { Matrix } from 'pixi.js'
import { Bezier } from 'bezier-js'
import { startDrag } from 'rmst-design'
import { cloneDeep } from 'es-toolkit'

/**
 * 生成 SVG path d 属性值（绝对坐标 三次贝塞尔曲线）
 * @param {Object} start - 起点绝对坐标 {x: number, y: number}
 * @param {Object} control1 - 第一个控制点绝对坐标 {x: number, y: number}
 * @param {Object} control2 - 第二个控制点绝对坐标 {x: number, y: number}
 * @param {Object} end - 终点绝对坐标 {x: number, y: number}
 * @param {boolean} [closePath=false] - 是否闭合路径（终点连回起点）
 * @returns {string} SVG path 的 d 属性值
 */
function generateCubicBezierPathD(start, control1, control2, end, closePath = false) {
  // 校验参数（避免坐标缺失导致绘制异常）
  if (!start?.x || !start?.y || !control1?.x || !control1?.y || !control2?.x || !control2?.y || !end?.x || !end?.y) {
    throw new Error('参数错误：所有点都必须提供有效的 x 和 y 绝对坐标')
  }

  // 构建 d 属性值：M(移动到起点) + C(三次贝塞尔曲线，绝对坐标)
  let d = `M ${start.x} ${start.y} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${end.x} ${end.y}`

  // 可选：闭合路径（Z 指令，绝对坐标下直接闭合）
  if (closePath) {
    d += ' Z'
  }

  return d
}

export default function Page(props) {
  const [b, setB] = useState({
    start: { x: 100, y: 100 },
    control1: { x: 200, y: 100 },
    control2: { x: 100, y: 200 },
    end: { x: 300, y: 300 }
  })

  const curve = new Bezier(b.start, b.control1, b.control2, b.end)

  let t = 0
  var pt = curve.get(t)
  var d0 = curve.derivative(t)

  // 4. 处理向量，确定切线的终点
  // 我们希望切线画出来长 100 像素
  const lineLength = 200

  // 计算长度 (模)
  const magnitude = Math.sqrt(d0.x * d0.x + d0.y * d0.y)

  // 归一化并乘以期望长度
  const targetVector = {
    x: (d0.x / magnitude) * lineLength,
    y: (d0.y / magnitude) * lineLength
  }

  // 计算切线终点坐标
  const pEnd = {
    x: pt.x + targetVector.x,
    y: pt.y + targetVector.y
  }

  const onDown = (downEvt, key) => {
    let downSnap = cloneDeep(b)

    startDrag(downEvt, {
      onDragMove(moveEvt) {
        const newPos = {
          x: downSnap[key].x + moveEvt.clientX - downEvt.clientX,
          y: downSnap[key].y + moveEvt.clientY - downEvt.clientY
        }

        setB({ ...b, [key]: newPos })
      }
    })
  }

  return (
    <div>
      <svg width={600} height={600} viewBox="0 0 600 600" className="border">
        <path d="M 10 100, L 100 100 " fill="none" stroke="red" />
        <path d={generateCubicBezierPathD(b.start, b.control1, b.control2, b.end)} fill="none" stroke="black" />

        <g>
          <line x1={pt.x} y1={pt.y} x2={pEnd.x} y2={pEnd.y} stroke="purple" strokeDasharray="5, 5" />
          <circle cx={pt.x} cy={pt.y} r={3} fill="blue" />
          <circle cx={pEnd.x} cy={pEnd.y} r={3} fill="green" />
        </g>

        <g>
          <line x1={b.control2.x} y1={b.control2.y} x2={b.end.x} y2={b.end.y} stroke="purple" />
          <circle cx={b.end.x} cy={b.end.y} r={4} fill="red" onPointerDown={downEvt => onDown(downEvt, 'end')} />
          <circle cx={b.control2.x} cy={b.control2.y} r={4} fill="red" onPointerDown={downEvt => onDown(downEvt, 'control2')} />
        </g>

        <g>
          <line x1={b.control1.x} y1={b.control1.y} x2={b.start.x} y2={b.start.y} stroke="purple" />
          <circle cx={b.start.x} cy={b.start.y} r={4} fill="red" onPointerDown={downEvt => onDown(downEvt, 'start')} />
          <circle cx={b.control1.x} cy={b.control1.y} r={4} fill="red" onPointerDown={downEvt => onDown(downEvt, 'control1')} />
        </g>
      </svg>
    </div>
  )
}
