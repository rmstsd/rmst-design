'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SIDES = [
  {
    label: 'home',
    href: '/'
  },
  {
    label: 'Button',
    href: '/Button'
  },
  {
    label: 'TextEllipsis',
    href: '/TextEllipsis'
  },
  {
    label: 'Modal',
    href: '/Modal'
  },
  {
    label: 'Drawer',
    href: '/Drawer'
  }
]

export default function Side() {
  const pathname = usePathname()

  return (
    <aside className="aside h-screen border-r flex flex-col shrink-0 p-2" style={{ width: 160 }}>
      {SIDES.map(item => (
        <Link key={item.href} href={item.href} className={clsx(pathname === item.href && 'active')}>
          {item.label}
        </Link>
      ))}
    </aside>
  )
}
