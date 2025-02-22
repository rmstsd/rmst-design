import { forwardRef, ReactNode, useContext, useMemo } from 'react'
import { GridItemProps } from './interface'
import { useResponsiveState } from './hooks/useResponsiveState'
import { GridContext } from './context'
import { resolveItemData } from './utils'
import ConfigContext from '../_util/ConfigProvider'
import clsx from 'clsx'

const defaultProps: GridItemProps = { suffix: false, offset: 0, span: 1 }

function GridItem(baseProps: GridItemProps, ref) {
  const { prefixCls } = useContext(ConfigContext)
  const props = { ...defaultProps, ...baseProps }

  const { children, className, style, offset: propOffset, span: propSpan } = props
  const gridContext = useContext(GridContext)
  const { colGap, cols } = gridContext

  const offset = useResponsiveState(propOffset, 0)
  const span = useResponsiveState(propSpan, 1)

  const classNames = clsx(`${prefixCls}-grid-item`, className)

  const itemData = useMemo(() => {
    return resolveItemData(gridContext.cols, { suffix: !!props.suffix, span, offset })
  }, [gridContext.cols, props.suffix, span, offset])

  const offsetStyle = useMemo(() => {
    const { offset, span } = itemData
    if (offset > 0) {
      const oneSpan = `(100% - ${colGap * (span - 1)}px) / ${span}`
      return {
        marginLeft: `calc((${oneSpan} * ${offset}) + ${colGap * offset}px)`
      }
    }
    return {}
  }, [itemData, colGap])

  const columnStart = useMemo(() => {
    const { suffix, span } = itemData
    if (suffix) {
      return `${cols - span + 1}`
    }
    return `span ${span}`
  }, [itemData, cols])

  const gridItemStyle = { gridColumn: `${columnStart} / span ${span}`, ...offsetStyle }

  return (
    <div ref={ref} className={classNames} style={{ ...gridItemStyle, ...style }}>
      {children as ReactNode}
    </div>
  )
}
const GridItemComponent = forwardRef(GridItem)

export default GridItemComponent

export type { GridItemProps }
