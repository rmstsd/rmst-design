'use client'

import { useState } from 'react'
import { Button } from 'rmst-design'

export default function ButtonDd() {
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button
          size="small"
          type="primary"
          loading={loading}
          onClick={() => {
            setLoading(true)

            setTimeout(() => {
              setLoading(false)
            }, 2000)
          }}
        >
          small primary
        </Button>
        <Button size="default" type="outline">
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
