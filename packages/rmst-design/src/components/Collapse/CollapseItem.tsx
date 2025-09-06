import { ReactNode, use } from 'react'
import clsx from 'clsx'

import { useAnTransition } from '../_util/hooks'
import ConfigContext from '../_util/ConfigProvider'
import { IconWrapper } from '../IconWrapper'
import { ChevronRight } from 'lucide-react'

export interface Item {
  onlyKey: string | number
  title: ReactNode
  children: ReactNode
}

interface CollapseItemProps {
  item: Item
  activeKey: Item['onlyKey'][]
  updateKey: (key: Item['onlyKey']) => void
}

export default function CollapseItem(props: CollapseItemProps) {
  const { activeKey, item, updateKey } = props
  const { onlyKey, title, children } = item

  const { prefixCls } = use(ConfigContext)

  const expanded = activeKey.includes(onlyKey)
  const { shouldMount, setDomRef } = useAnTransition({
    open: expanded,
    appear: false,
    keyframes: el => {
      return [
        { height: '0px', opacity: 0 },
        { height: `${el.offsetHeight}px`, opacity: 1 }
      ]
    }
  })

  return (
    <div className={`${prefixCls}-collapse-item`}>
      <div
        className={clsx(`${prefixCls}-collapse-item-header`, shouldMount && `${prefixCls}-collapse-item-header-active`)}
        onClick={() => updateKey(onlyKey)}
      >
        <IconWrapper style={{ transform: `rotate(${expanded ? 90 : 0}deg)` }}>
          <ChevronRight />
        </IconWrapper>
        {title}
      </div>

      {shouldMount && (
        <div className={`${prefixCls}-collapse-item-content`} ref={setDomRef}>
          <div className={`${prefixCls}-collapse-item-content-box`}>{children}</div>
        </div>
      )}
    </div>
  )
}
