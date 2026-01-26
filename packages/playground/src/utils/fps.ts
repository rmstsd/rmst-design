export function fps(cb) {
  let frameCount = 0
  let lastTime = performance.now()

  function loop(now) {
    frameCount++
    if (now - lastTime >= 1000) {
      cb?.(frameCount)

      frameCount = 0
      lastTime = now
    }

    requestAnimationFrame(loop)
  }

  requestAnimationFrame(loop)
}
