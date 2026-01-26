'use client'

import { useEffect, useState } from 'react'
import { Stage } from './stage'

export default function Client(props) {
  useEffect(() => {
    const stage = new Stage()
    const container = document.querySelector('.can-container')

    const observer = new ResizeObserver(() => {
      stage.updateSize()
      stage.draw()
    })

    observer.observe(container)

    stage.init(container)

    stage.draw()

    return () => {
      stage.dispose()
      stage.clear()
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div className="can-container h-full relative overflow-clip touch-none border"></div>
    </>
  )
}
