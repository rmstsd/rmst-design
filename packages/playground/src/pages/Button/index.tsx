import { useRef } from 'react'
import { Button } from 'rmst-design'

export default function ButtonDd() {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <div>
      <Button
        ref={ref}
        onClick={() => {
          console.log('点击了按钮', ref.current)
        }}
      >
        按钮
      </Button>
    </div>
  )
}
