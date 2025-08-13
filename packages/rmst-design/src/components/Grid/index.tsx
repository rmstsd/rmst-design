import Col from './col'
import Row from './row'
import OriginGrid from './grid'
import GridItem from './grid-item'

import './style/index'

const Grid = OriginGrid as typeof OriginGrid & {
  Col: typeof Col
  Row: typeof Row
  GridItem: typeof GridItem
}

Grid.Col = Col
Grid.Row = Row
Grid.GridItem = GridItem

export { Grid }

export type { RowProps, ColProps, GridProps, ResponsiveValue } from './interface'
