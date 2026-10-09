'use client'

import { startTransition, useState, ViewTransition } from 'react'
import type { ReactNode } from 'react'

import './page.scss'

type AccordionItem = {
  id: string
  title: string
  subtitle?: string
  content: ReactNode
  disabled?: boolean
}

type AccordionProps = {
  items: AccordionItem[]
  selectionMode?: 'single' | 'multiple'
  defaultExpandedKeys?: string[]
  variant?: 'default' | 'splitted'
}

const animateAccordionContent = (target: Element, direction: 'enter' | 'exit') => {
  const isEntering = direction === 'enter'
  const animation = target.animate(
    [
      {
        opacity: isEntering ? 0 : 1,
        clipPath: isEntering ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)'
      },
      {
        opacity: isEntering ? 1 : 0,
        clipPath: isEntering ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)'
      }
    ],
    {
      duration: 300,
      easing: 'linear',
      fill: 'both'
    }
  )

  return () => animation.cancel()
}

const accordionItems: AccordionItem[] = [
  {
    id: 'getting-started',
    title: 'Accordion 1',
    subtitle: '开始使用',
    content: (
      <p>
        Accordion 将内容组织成可展开的区块。点击标题即可查看详情，再次点击收起内容。 展开和收起由 ViewTransition
        驱动，下方条目会跟随内容高度平滑移动。
      </p>
    )
  },
  {
    id: 'selection',
    title: 'Accordion 2',
    subtitle: '单项与多项展开',
    content: (
      <div className="vt-accordion__details">
        <p>单项模式一次只能展开一个区块；多项模式允许同时展开多个区块。</p>
        <ul>
          <li>点击上方按钮切换展开模式。</li>
          <li>展开中的条目可以再次点击收起。</li>
          <li>每个条目都有独立的过渡边界。</li>
        </ul>
      </div>
    )
  },
  {
    id: 'appearance',
    title: 'Accordion 3',
    subtitle: '两种外观',
    content: (
      <p>默认外观使用分隔线连接各个区块，独立卡片外观则为每个区块提供背景、圆角和阴影。 切换外观时，当前的展开状态会保留。</p>
    )
  },
  {
    id: 'disabled',
    title: 'Accordion 4',
    subtitle: '此条目已禁用',
    content: <p>禁用的条目无法展开。</p>,
    disabled: true
  }
]

function Accordion({ items, selectionMode = 'single', defaultExpandedKeys = [], variant = 'default' }: AccordionProps) {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(() => {
    const enabledKeys = defaultExpandedKeys.filter(key => items.some(item => item.id === key && !item.disabled))

    return selectionMode === 'single' ? enabledKeys.slice(0, 1) : enabledKeys
  })

  // 单项模式只展示最后展开的一项，切换模式不需要重置组件。
  const visibleKeys = selectionMode === 'single' ? expandedKeys.slice(-1) : expandedKeys

  const toggleItem = (item: AccordionItem) => {
    if (item.disabled) {
      return
    }

    startTransition(() => {
      setExpandedKeys(currentKeys => {
        const activeKeys = selectionMode === 'single' ? currentKeys.slice(-1) : currentKeys

        if (activeKeys.includes(item.id)) {
          return activeKeys.filter(key => key !== item.id)
        }

        return selectionMode === 'multiple' ? [...activeKeys, item.id] : [item.id]
      })
    })
  }

  return (
    <div className="vt-accordion" data-variant={variant}>
      {items.map(item => {
        const isExpanded = visibleKeys.includes(item.id)

        return (
          <div key={item.id}>
            <section className="vt-accordion__item">
              <ViewTransition default="vt-accordion-heading">
                <h2 className="vt-accordion__heading">
                  <button
                    className="vt-accordion__trigger"
                    type="button"
                    disabled={item.disabled}
                    onClick={() => toggleItem(item)}
                  >
                    <span className="vt-accordion__label">
                      <span className="vt-accordion__title">{item.title}</span>
                      {item.subtitle && <span className="vt-accordion__subtitle">{item.subtitle}</span>}
                    </span>
                    <svg className="vt-accordion__indicator" viewBox="0 0 24 24" fill="none">
                      <polyline points="9 5 16 12 9 19" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </button>
                </h2>
              </ViewTransition>

              {isExpanded && (
                <ViewTransition
                  enter="vt-accordion-content"
                  exit="vt-accordion-content"
                  onEnter={instance => animateAccordionContent((instance as unknown as { new: Element }).new, 'enter')}
                  onExit={instance => animateAccordionContent((instance as unknown as { old: Element }).old, 'exit')}
                >
                  <div className="vt-accordion__content">{item.content}</div>
                </ViewTransition>
              )}
            </section>
          </div>
        )
      })}
    </div>
  )
}

export default function Page() {
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single')
  const [variant, setVariant] = useState<'default' | 'splitted'>('default')

  return (
    <main className="vt-accordion-demo">
      <div className="vt-accordion-demo__intro">
        <span className="vt-accordion-demo__eyebrow">COMPONENT PLAYGROUND</span>
        <h1>Accordion</h1>
        <p>点击标题展开内容，试试同时展开多个区块。</p>
      </div>

      <div className="vt-accordion-demo__controls">
        <div className="vt-accordion-demo__options">
          {(['single', 'multiple'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              data-selected={selectionMode === mode}
              onClick={() => startTransition(() => setSelectionMode(mode))}
            >
              {mode === 'single' ? '单项展开' : '多项展开'}
            </button>
          ))}
        </div>
        <div className="vt-accordion-demo__options">
          {(['default', 'splitted'] as const).map(value => (
            <button
              key={value}
              type="button"
              data-selected={variant === value}
              onClick={() => startTransition(() => setVariant(value))}
            >
              {value === 'default' ? '默认样式' : '独立卡片'}
            </button>
          ))}
        </div>
      </div>

      <Accordion
        items={accordionItems}
        selectionMode={selectionMode}
        defaultExpandedKeys={['getting-started']}
        variant={variant}
      />

      <ViewTransition default="vt-accordion-heading">
        <p className="vt-accordion-demo__hint">支持再次点击收起 · 第四项为禁用状态</p>
      </ViewTransition>
    </main>
  )
}
