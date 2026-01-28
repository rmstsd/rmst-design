export {}

const canvas = new OffscreenCanvas(100, 100)
const ctx = canvas.getContext('2d')

self.onmessage = (evt: MessageEvent) => {
  const { type, payload } = evt.data

  switch (type) {
    case 'render': {
      const { chunk, mt } = payload
      ctx.resetTransform()
      ctx.setTransform(mt.a, mt.b, mt.c, mt.d, mt.e, mt.f)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      chunk.forEach((rect: any) => {
        ctx.fillStyle = rect.color
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
      })

      postMessage({
        type: 'render',
        payload: { imageBitmap: canvas.transferToImageBitmap() }
      })

      break
    }
    case 'resize': {
      canvas.width = payload.width
      canvas.height = payload.height
      break
    }
  }
}
