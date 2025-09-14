'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Scrollbar } from 'rmst-design'

const componentsConfig = [
  {
    group: '基础',
    components: [
      {
        label: 'LdLayout',
        path: '/LdLayout'
      },
      {
        label: 'Button',
        path: '/Button'
      },
      {
        label: 'TextEllipsis',
        path: '/TextEllipsis'
      }
    ]
  },
  {
    group: '布局',
    components: [
      {
        label: 'Grid',
        path: '/Grid'
      }
    ]
  },
  {
    group: '反馈',
    components: [
      {
        label: 'Modal',
        path: '/Modal'
      },
      {
        label: 'Drawer',
        path: '/Drawer'
      }
    ]
  },
  {
    group: '数据输入',
    components: [
      {
        label: 'Input',
        path: '/Input'
      },
      {
        label: 'Select',
        path: '/Select'
      },
      {
        label: 'DatePicker',
        path: '/DatePicker'
      },
      {
        label: 'Switch',
        path: '/Switch'
      }
    ]
  },
  {
    group: '数据展示',
    components: [
      {
        label: 'Image',
        path: '/Image'
      },
      {
        label: 'Collapse',
        path: '/Collapse'
      }
    ]
  },
  {
    group: '其他',
    components: [
      {
        label: 'Trigger',
        path: '/Trigger'
      },
      {
        label: 'Mask',
        path: '/Mask'
      },
      {
        label: 'Scrollbar',
        path: '/Scrollbar'
      }
    ]
  }
]

export default function Side() {
  const pathname = usePathname()

  return (
    <Scrollbar className="aside h-screen border-r shrink-0" style={{ width: 160 }}>
      {componentsConfig.map(item => (
        <div key={item.group}>
          <div className="text-sm py-2 text-gray-500">{item.group}</div>

          {item.components.map(cItem => {
            const href = `/components${cItem.path}`

            return (
              <Link key={cItem.path} href={href} className={clsx('block', pathname === href && 'active')}>
                {cItem.label}
              </Link>
            )
          })}
        </div>
      ))}
    </Scrollbar>
  )
}
