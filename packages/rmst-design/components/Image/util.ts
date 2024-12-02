export function getPosition(naturalWidth: number, naturalHeight: number) {
  const vpSize = getViewportSize()

  const containerRatio = vpSize.width / vpSize.height
  const imageRatio = naturalWidth / naturalHeight

  if (containerRatio > imageRatio) {
    const width = imageRatio * vpSize.height
    const height = vpSize.height

    const x = (vpSize.width - width) / 2
    const y = 0

    return { x, y, width, height }
  } else {
    const width = vpSize.width
    const height = vpSize.width / imageRatio

    const x = 0
    const y = (vpSize.height - height) / 2

    return { x, y, width, height }
  }
}

function getViewportSize() {
  const { clientWidth, clientHeight } = document.documentElement
  const size = { width: clientWidth, height: clientHeight }
  return size
}
