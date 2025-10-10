import { Grid } from 'rmst-design'

const { GridItem } = Grid

export default function GridDd() {
  return (
    <div className="gr-demo">
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
