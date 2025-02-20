import { Button, TextEllipsis } from 'rmst-design'

import './style.less'

function ButtonDd() {
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

import { Grid } from 'rmst-design'

const Row = Grid.Row
const Col = Grid.Col

export default function Dde() {
  return (
    <div className="overflow-auto resize-x">
      <Row className="grid-demo">
        <Col xs={2} sm={4} md={6} lg={8} xl={10} xxl={8}>
          Col
        </Col>
        <Col xs={20} sm={16} md={12} lg={8} xl={4} xxl={8}>
          Col
        </Col>
        <Col xs={2} sm={4} md={6} lg={8} xl={10} xxl={8}>
          Col
        </Col>
      </Row>
    </div>
  )
}
