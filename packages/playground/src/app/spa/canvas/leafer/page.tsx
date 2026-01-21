'use client'

import { Leafer, App, Rect, Box, Leaf } from 'leafer-ui'
import '@leafer-in/viewport'

import { useEffect } from 'react'
import { genRects } from '../constant'

export default function LeaferDemo() {
  useEffect(() => {
    const container = document.querySelector('.ll-aa')
    var app = new App({
      view: container,
      tree: { type: 'viewport' }
    })

    app.config.move.drag = true

    const randomRects = genRects(1_0000, container.clientWidth, container.clientHeight)

    randomRects.forEach(rect => {
      const rectItem = new Rect({ ...rect })
      app.tree.add(rectItem)
    })

    return () => {
      app.destroy(true)
    }
  }, [])
  return <div className="ll-aa h-full"></div>
}
