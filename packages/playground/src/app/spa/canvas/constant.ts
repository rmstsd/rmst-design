import randomColor from 'randomcolor'

export const genRects = (length, clientWidth, clientHeight, size = 20) => {
  const randomRects = Array.from({ length }, () => {
    const x = Math.floor(100 + Math.random() * (clientWidth - 200))
    const y = Math.floor(100 + Math.random() * (clientHeight - 200))
    const width = Math.floor(Math.random() * size)
    const height = Math.floor(Math.random() * size)
    const fill = randomColor()

    return {
      x,
      y,
      width,
      height,
      fill
    }
  })

  return randomRects
}

function getRandomRGBA() {
  const r = Math.floor(Math.random() * 256) // 红色通道
  const g = Math.floor(Math.random() * 256) // 绿色通道
  const b = Math.floor(Math.random() * 256) // 蓝色通道
  const a = Math.random().toFixed(2) // alpha 通道，保留两位小数
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
