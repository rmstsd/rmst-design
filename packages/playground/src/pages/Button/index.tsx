import { Button } from 'rmst-design'
import './style.less'
import { useState } from 'react'

export default function ButtonDd() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button
          size="small"
          type="primary"
          loading={isLoading}
          onClick={() => {
            setIsLoading(true)

            setTimeout(() => {
              setIsLoading(false)
            }, 2000)
          }}
        >
          small primary
        </Button>
        <Button size="default" type="outline" loading={isLoading}>
          default outline
        </Button>
        <Button size="large" type="text">
          large text
        </Button>
      </div>

      <br />

      <div style={{ display: 'flex', gap: '10px' }}>
        <Button size="small" type="primary" disabled>
          small primary
        </Button>
        <Button size="default" type="outline" disabled>
          default outline
        </Button>
        <Button size="large" type="text" disabled>
          large text
        </Button>
      </div>
    </div>
  )
}
