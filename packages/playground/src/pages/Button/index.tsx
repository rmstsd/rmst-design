import { Button } from 'rmst-design'

import './style.less'

export default function ButtonDd() {
  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button size="small" type="primary">
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
