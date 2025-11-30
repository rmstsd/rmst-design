import { Grid } from 'rmst-design'

import './style.scss'

const { GridItem } = Grid

export default function GridDd() {
  return (
    <div className="gr-demo">
      {/* <div className="container">
        <h1>哈哈哈</h1>
      </div>

      <div className="container2 ">
        <h1>哈哈哈</h1>
      </div> */}

      <div className="container-flex border m-4">
        <div className="left">哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</div>
        <div className="right">啊顺丰到付地方</div>
      </div>

      <Grid cols={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
        {/* <GridItem>1</GridItem>
        <GridItem>2</GridItem>
        <GridItem>3</GridItem>
        <GridItem>4</GridItem>
        <GridItem>5</GridItem>
        <GridItem>6</GridItem>
        <GridItem>7</GridItem> */}
      </Grid>
    </div>
  )
}
