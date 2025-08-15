'use client'

import { unstableSetRender } from 'antd'
import { use, useLayoutEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'

export default function AntdPatch() {
  useLayoutEffect(() => {
    if (typeof window === 'object') {
      unstableSetRender((node, container) => {
        container._reactRoot ||= createRoot(container)
        const root = container._reactRoot
        root.render(node)
        return async () => {
          await new Promise(resolve => setTimeout(resolve, 0))
          root.unmount()
        }
      })
    }
  }, [])

  return null
}
