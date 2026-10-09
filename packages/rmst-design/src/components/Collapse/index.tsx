import { ReactNode, startTransition, use, useState, ViewTransition } from 'react'
import clsx from 'clsx'
import ConfigContext from '../_util/ConfigProvider'
import { IconWrapper } from '../IconWrapper'
import { ChevronRight } from 'lucide-react'

import './style.less'

export interface Item {
  onlyKey: string | number
  title: ReactNode
  children: ReactNode
}

interface CollapseProps {
  items: Item[]
  defaultActiveKey?: Item['onlyKey'][]
  accordion?: boolean
}

export function Collapse(props: CollapseProps) {
  const { items, defaultActiveKey, accordion } = props

  const { prefixCls } = use(ConfigContext)

  const [activeKey, setActiveKey] = useState(defaultActiveKey ?? [])
  const animationOptions = { duration: 300, easing: 'ease' }

  const keyframes = [
    { opacity: 1, clipPath: 'inset(0 0 100% 0)' },
    { opacity: 1, clipPath: 'inset(0 0 0 0)' }
  ]

  const updateKey = (key: Item['onlyKey']) => {
    startTransition(() => {
      setActiveKey(currentKeys => {
        if (accordion) {
          return currentKeys.includes(key) ? [] : [key]
        }

        return currentKeys.includes(key)
          ? currentKeys.filter(currentKey => currentKey !== key)
          : [...currentKeys, key]
      })
    })
  }

  return (
    <div className={`${prefixCls}-collapse`}>
      {items.map(({ onlyKey, title, children }) => {
        const expanded = activeKey.includes(onlyKey)

        return (
          <div key={onlyKey} className={`${prefixCls}-collapse-item`}>
            <ViewTransition update="collapse-item">
              <div
                className={clsx(
                  `${prefixCls}-collapse-item-header`,
                  expanded && `${prefixCls}-collapse-item-header-active`
                )}
                onClick={() => updateKey(onlyKey)}
              >
                <IconWrapper style={{ transform: `rotate(${expanded ? 90 : 0}deg)` }}>
                  <ChevronRight />
                </IconWrapper>
                {title}
              </div>
            </ViewTransition>

            {expanded && (
              <ViewTransition
                onEnter={instance => {
                  instance.new.animate(keyframes, animationOptions)
                }}
                onExit={instance => {
                  instance.old.animate(keyframes.toReversed(), animationOptions)
                }}
              >
                <div className={`${prefixCls}-collapse-item-content`}>
                  <div className={`${prefixCls}-collapse-item-content-box`}>{children}</div>
                </div>
              </ViewTransition>
            )}
          </div>
        )
      })}
    </div>
  )
}
