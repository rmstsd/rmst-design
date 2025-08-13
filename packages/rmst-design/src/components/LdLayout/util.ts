export function calcDistancePointToEdge(point, rect) {
  // const distanceTop = Math.abs(point.y - rect.y)
  // const distanceBottom = Math.abs(point.y - (rect.y + rect.height))
  const distanceLeft = Math.abs(point.x - rect.x)
  const distanceRight = Math.abs(point.x - (rect.x + rect.width))
  return Math.min(distanceLeft, distanceRight)
  // return Math.min(distanceTop, distanceBottom)
}

export function isPointInRect(point, rect, sensitive = true) {
  const boundSensor = (value: number) => {
    if (!sensitive) return 0
    const sensor = value * 0.1
    if (sensor > 20) return 20
    if (sensor < 10) return 10
    return sensor
  }

  return (
    point.x >= rect.x + boundSensor(rect.width) &&
    point.x <= rect.x + rect.width - boundSensor(rect.width) &&
    point.y >= rect.y + boundSensor(rect.height) &&
    point.y <= rect.y + rect.height - boundSensor(rect.height)
  )
}
export function isNearAfter(point, rect) {
  return Math.abs(point.x - rect.x) > Math.abs(point.x - (rect.x + rect.width))
}
