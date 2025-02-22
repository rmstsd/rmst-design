import { forwardRef, useContext } from 'react'
import { GridProps } from './interface'
import cs from 'clsx'
import { useResponsiveState } from './hooks/useResponsiveState'
import { GridContext } from './context'
import ConfigContext from '../_util/ConfigProvider'

const defaultProps: GridProps = { collapsed: false, collapsedRows: 1, cols: 24, colGap: 0, rowGap: 0 }

function Grid(baseProps: GridProps, ref) {
  const { prefixCls } = useContext(ConfigContext)
  const props = { ...defaultProps, ...baseProps }
  const { children, className, style, cols: propCols, colGap: propColGap, rowGap: propRowGap } = props

  const cols = useResponsiveState(propCols, 24)
  const colGap = useResponsiveState(propColGap, 0)
  const rowGap = useResponsiveState(propRowGap, 0)

  const gridStyle = { gap: `${rowGap}px ${colGap}px`, gridTemplateColumns: `repeat(${cols}, minmax(0px, 1fr))` }
  const classNames = cs(`${prefixCls}-grid`, className)

  return (
    <div ref={ref} className={classNames} style={{ ...gridStyle, ...style }}>
      <GridContext.Provider value={{ cols, colGap }}>{children}</GridContext.Provider>
    </div>
  )
}

const GridComponent = forwardRef(Grid)

GridComponent.displayName = 'Grid'

export default GridComponent

export type { GridProps }
