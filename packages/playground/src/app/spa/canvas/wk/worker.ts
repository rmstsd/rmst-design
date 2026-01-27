addEventListener('message', (event: MessageEvent<number>) => {
  console.log('worker receive message', event.data)
  postMessage(event.data)
})
