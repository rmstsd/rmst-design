// 创建 5 万个矩形，每个矩形 20x20 像素，有规律的摆放，摆放5 列 每列一万个

export function create(num) {
  const groupSize = 10 * 100 * 1.5
  const column = num > 25 ? 10 : 5
  const rects = []
  for (let i = 0; i < num; i++) {
    let x = groupSize * (i % column)
    let y = groupSize * Math.floor(i / column)

    rects.push(...createRects(x, y, `hsl(${(i * 10) % 360},70%,50%)`))
  }

  return rects.flat(1)
}

function createRects(startX, startY, color) {
  let rects = []
  let y, rect
  for (let i = 0; i < 100; i++) {
    if (i % 10 === 0) startX += 10
    y = startY
    for (let j = 0; j < 100; j++) {
      if (j % 10 === 0) y += 10
      rect = {}
      rect.x = startX
      rect.y = y
      rect.height = 10
      rect.width = 10
      rect.size = 10
      rect.color = color
      rect.fill = color
      rect.editable = true

      rects.push(rect)
      y += 12
    }
    startX += 12
  }

  return rects
}
