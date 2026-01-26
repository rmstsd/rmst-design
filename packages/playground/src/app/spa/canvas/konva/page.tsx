'use client'

import { useEffect } from 'react'
import Konva from 'konva'

export default function Page(props) {
  useEffect(() => {
    const stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight
    })

    const layer = new Konva.Layer()
    stage.add(layer)

    // Create a group of circles
    const group = new Konva.Group({
      x: stage.width() / 2,
      y: stage.height() / 2
    })
    layer.add(group)

    // Add initial circles
    const addCircles = count => {
      const radius = 300
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * radius
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance

        const circle = new Konva.Circle({
          x,
          y,
          radius: 5 + Math.random() * 10,
          fill: Konva.Util.getRandomColor(),
          listening: false
        })

        group.add(circle)
      }
    }

    // Add initial circles
    addCircles(10)

    // Add FPS counter
    const fpsText = new Konva.Text({
      x: 10,
      y: 10,
      text: 'FPS: 0',
      fontSize: 16,
      fill: 'black'
    })
    layer.add(fpsText)

    // Add circle count text
    const countText = new Konva.Text({
      x: 10,
      y: 40,
      text: 'Circles: 1000',
      fontSize: 16,
      fill: 'black'
    })
    layer.add(countText)

    // Create animation
    const anim = new Konva.Animation(frame => {
      group.rotation(frame.time * 0.05)

      // Update FPS counter
      fpsText.text('FPS: ' + frame.frameRate.toFixed(1))
    }, layer)

    // Add click handler to add more circles
    stage.on('click', () => {
      addCircles(1000)
      countText.text('Circles: ' + group.children.length)
    })

    // Add DOM checkbox
    const container = stage.container()
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = 'cache-toggle'
    checkbox.style.position = 'absolute'
    checkbox.style.top = '70px'
    checkbox.style.left = '10px'
    checkbox.style.zIndex = '100'
    container.appendChild(checkbox)

    const label = document.createElement('label')
    label.htmlFor = 'cache-toggle'
    label.textContent = 'Enable Caching'
    label.style.position = 'absolute'
    label.style.top = '70px'
    label.style.left = '30px'
    label.style.color = 'white'
    label.style.textShadow = '0 0 5px black'
    label.style.zIndex = '100'
    container.appendChild(label)

    // Toggle caching
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        group.cache()
      } else {
        group.clearCache()
      }
    })

    anim.start()
  }, [])

  return (
    <div>
      <div id="container"></div>
    </div>
  )
}
