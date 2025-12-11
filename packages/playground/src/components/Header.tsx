'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { SelectTheme } from './Theme'

export const headerHeight = 48

export default function Header() {
  const pathname = usePathname()

  return (
    <header
      className="site-header border-b border-gray-200 flex items-center px-2 fixed top-0 w-full z-10 gap-2"
      style={{ height: headerHeight }}
    >
      <Link href="/" className={pathname === '/' ? 'header-link-active' : ''}>
        首页
      </Link>

      <Link href="/components/Button" className={pathname.startsWith('/components/') ? 'header-link-active' : ''}>
        组件
      </Link>

      <Link href="/ahome" className={pathname === '/ahome' ? 'header-link-active' : ''}>
        ahome
      </Link>

      <Link href="/blog" className={pathname === '/blog' ? 'header-link-active' : ''}>
        blog
      </Link>

      <Link href="/gta6" className={pathname === '/gta6' ? 'header-link-active' : ''}>
        gta6
      </Link>

      <SelectTheme />
    </header>
  )
}
