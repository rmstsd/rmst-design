import { useEffect, useState } from 'react'

export function fps(cb) {
  let frameCount = 0
  let lastTime = performance.now()

  let timer

  function loop(now) {
    frameCount++
    if (now - lastTime >= 1000) {
      cb?.(frameCount)

      frameCount = 0
      lastTime = now
    }

    timer = requestAnimationFrame(loop)
  }

  timer = requestAnimationFrame(loop)

  return () => {
    cancelAnimationFrame(timer)
  }
}

export const useFps = () => {
  const [_fps, setFps] = useState(0)
  useEffect(() => {
    const cancel = fps(setFps)

    return cancel
  }, [])

  return _fps
}
