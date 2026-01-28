'use client'

import { useFps } from '@/utils/fps'
import { useRef, useLayoutEffect, useState, useEffect } from 'react'

// 全局共享的离屏测量上下文（整个模块只创建一次）
let measureCtx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null = null

function getMeasureCtx() {
  if (measureCtx) return measureCtx
  const canvas = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(0, 0) : document.createElement('canvas')
  measureCtx = canvas.getContext('2d')!
  return measureCtx
}

// 宽度缓存，键为 `font\ntext`，避免 resize 二分时重复调用 measureText
const widthCache = new Map<string, number>()

function measureTextWidth(text: string, font: string): number {
  const key = font + '\n' + text
  const cached = widthCache.get(key)
  if (cached !== undefined) return cached

  const ctx = getMeasureCtx()
  if (ctx.font !== font) ctx.font = font
  const width = ctx.measureText(text).width
  widthCache.set(key, width)
  return width
}

function TruncatedPath({ path }: { path: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayText, setDisplayText] = useState(path)
  const fontRef = useRef<string>('')

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 初始化字体信息（只获取一次）
    if (!fontRef.current) {
      const computedStyle = window.getComputedStyle(container)
      fontRef.current = `${computedStyle.fontSize} ${computedStyle.fontFamily}`
    }

    const measureText = (text: string): number => measureTextWidth(text, fontRef.current)

    const truncatePath = (containerWidth: number) => {
      const ellipsis = '...'

      // 完整路径能显示，直接显示
      if (measureText(path) <= containerWidth) {
        setDisplayText(path)
        return
      }

      // 拆分目录与文件名（fileName 含前导 '/'）
      const lastSlash = path.lastIndexOf('/')
      const dirPath = lastSlash >= 0 ? path.slice(0, lastSlash) : ''
      const fileName = lastSlash >= 0 ? path.slice(lastSlash) : path

      // 阶段一：文件名保持完整，只从目录尾部截断
      // 形如 dirPrefix + '...' + fileName，要求至少留住一个目录字符，
      // 否则(即会退化成 '...文件名')立即进入阶段二的前后平衡模式
      if (dirPath && measureText(dirPath[0] + ellipsis + fileName) <= containerWidth) {
        let lo = 1
        let hi = dirPath.length
        let best = 1
        while (lo <= hi) {
          const mid = (lo + hi) >> 1
          const candidate = dirPath.slice(0, mid) + ellipsis + fileName
          if (measureText(candidate) <= containerWidth) {
            best = mid
            lo = mid + 1
          } else {
            hi = mid - 1
          }
        }
        setDisplayText(dirPath.slice(0, best) + ellipsis + fileName)
        return
      }

      // 阶段二：文件名也放不下，前后字符数尽量相等，中间显示 '...'
      let lo = 1
      let hi = path.length
      let bestLen = 0
      while (lo <= hi) {
        const total = (lo + hi) >> 1
        const front = Math.ceil(total / 2)
        const back = total - front
        const candidate = path.slice(0, front) + ellipsis + (back > 0 ? path.slice(-back) : '')
        if (measureText(candidate) <= containerWidth) {
          bestLen = total
          lo = total + 1
        } else {
          hi = total - 1
        }
      }
      const front = Math.ceil(bestLen / 2)
      const back = bestLen - front
      setDisplayText(path.slice(0, front) + ellipsis + (back > 0 ? path.slice(-back) : ''))
    }

    // 初始计算
    truncatePath(container.offsetWidth)

    // 监听容器尺寸变化，从回调参数拿新宽度（RO 在布局后触发，避免额外 reflow）
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        truncatePath(entry.contentRect.width)
      }
    })
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [path])

  return (
    <div ref={containerRef} title={path} style={{ overflow: 'hidden', textOverflow: 'clip', whiteSpace: 'nowrap' }}>
      {displayText}
    </div>
  )
}

export default function Page(props) {
  const path = 'D:/BaiduNetdisk/sysres/AIAssets/Square44x44Logo.scale-100.png'

  return (
    <div>
      <div className="mt-60"></div>
      {useFps()}
      <div className="c-container" style={{ marginLeft: 400 }}>
        <TruncatedPath path={path} />
      </div>
    </div>
  )
}
