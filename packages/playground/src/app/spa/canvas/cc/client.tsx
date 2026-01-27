'use client'

import { useEffect, useState } from 'react'
import { Stage } from './stage'

export default function Client(props) {
  const [stage, setStage] = useState<Stage>()

  useEffect(() => {
    const stage = new Stage()
    setStage(stage)
    const container = document.querySelector('.can-container')

    const observer = new ResizeObserver(() => {
      // stage.updateMainCanvasSize()
      // stage.drawMainCanvas()
    })

    observer.observe(container)

    stage.init(container)

    stage.drawMainCanvas()

    return () => {
      stage.dispose()
      stage.clear()
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div className="fixed top-0 left-0 p-2 z-30">
        <button onClick={() => stage.updateColor()}>updateColor</button>
        <button onClick={() => stage.zoomIn()}>放大</button>
        <button onClick={() => stage.zoomOut()}>缩小</button>
      </div>

      <div className="can-container h-full relative overflow-clip touch-none border"></div>
    </>
  )
}
