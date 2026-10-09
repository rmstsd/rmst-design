'use client'
import { startTransition, useState, ViewTransition } from 'react'
import Child from './Child'
import Container from './Container'
import './page.scss'

const accordionItems = [
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

export default function Page() {
  const [open, setOpen] = useState(false)
  const animationOptions = { duration: 200, easing: 'ease' }

  const kfs = [
    {
      opacity: 1,
      clipPath: 'inset(0 0 100% 0)'
    },
    {
      opacity: 1,
      clipPath: 'inset(0 0 0 0)'
    }
  ]

  const [openKeys, setOpenKeys] = useState([])

  return (
    <div>
      <button onClick={() => startTransition(() => setOpen(!open))}>open</button>
      {open && (
        <ViewTransition
          onEnter={instance => {
            instance.new.animate(kfs, animationOptions)
          }}
          onExit={instance => {
            instance.old.animate(kfs.toReversed(), animationOptions)
          }}
        >
          <div className="a-content bg-amber-100 h-16">123456</div>
        </ViewTransition>
      )}

      <ViewTransition update="ahome-other">
        <div className="other">789</div>
      </ViewTransition>

      <hr />

      {accordionItems.map(item => {
        const isOpen = openKeys.includes(item.id)

        return (
          <div key={item.id} className="">
            <ViewTransition update="ahome-other">
              <div
                className="p-2 border-b border-gray-300"
                onClick={() =>
                  startTransition(() => setOpenKeys(isOpen ? openKeys.filter(key => key !== item.id) : [...openKeys, item.id]))
                }
              >
                {item.title}
              </div>
            </ViewTransition>

            {isOpen && (
              <ViewTransition
                onEnter={instance => {
                  instance.new.animate(kfs, animationOptions)
                }}
                onExit={instance => {
                  instance.old.animate(kfs.toReversed(), animationOptions)
                }}
              >
                <div className="p-2">{item.content}</div>
              </ViewTransition>
            )}
          </div>
        )
      })}
    </div>
  )
}
