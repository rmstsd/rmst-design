'use client'
import { useEffect, useRef, useCallback } from 'react'

export default function Page() {
  const workerRef = useRef<Worker>(null)

  useEffect(() => {
    const url = new URL('./worker.ts', import.meta.url)
    console.log(url)
    workerRef.current = new Worker(url)
    workerRef.current.onmessage = (event: MessageEvent<number>) => {
      console.log(event.data)
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const handleWork = async () => {
    workerRef.current?.postMessage(100000)
  }

  return (
    <>
      <p>Do work in a WebWorker!</p>
      <button onClick={handleWork}>Calculate PI</button>
    </>
  )
}
