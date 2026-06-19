'use client'

import JSZip from 'jszip'
import { lookup } from 'mime-types'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

type PreviewState = 'idle' | 'loading' | 'ready' | 'error'

type AssetMap = Map<string, string>

const indexFileName = 'index.html'

const textDecoder = new TextDecoder()

const normalizeZipPath = (path: string) => {
  const parts: string[] = []

  path
    .replaceAll('\\', '/')
    .split('/')
    .forEach(part => {
      if (!part || part === '.') return

      if (part === '..') {
        parts.pop()
        return
      }

      parts.push(part)
    })

  return parts.join('/')
}

const getDirName = (path: string) => {
  const normalizedPath = normalizeZipPath(path)
  const lastSlashIndex = normalizedPath.lastIndexOf('/')
  return lastSlashIndex === -1 ? '' : normalizedPath.slice(0, lastSlashIndex + 1)
}

const isExternalOrSpecialUrl = (url: string) => {
  const trimmedUrl = url.trim()

  return !trimmedUrl || trimmedUrl.startsWith('#') || /^[a-z][a-z\d+.-]*:/i.test(trimmedUrl) || trimmedUrl.startsWith('//')
}

const decodePath = (path: string) => {
  try {
    return decodeURIComponent(path)
  } catch {
    return path
  }
}

const resolveZipPath = (value: string, baseDir: string) => {
  const [rawPath] = value.split(/[?#]/, 1)

  if (isExternalOrSpecialUrl(rawPath)) return null

  const path = rawPath.startsWith('/') ? rawPath.slice(1) : `${baseDir}${rawPath}`
  return normalizeZipPath(decodePath(path))
}

const createObjectUrl = (bytes: Uint8Array, path: string) => {
  const type = lookup(path) || 'application/octet-stream'
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
  return URL.createObjectURL(new Blob([buffer], { type }))
}

const readTextFile = async (file: JSZip.JSZipObject) => {
  const bytes = await file.async('uint8array')
  return textDecoder.decode(bytes)
}

const rewriteCssUrls = (css: string, baseDir: string, assetMap: AssetMap) =>
  css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (match, quote: string, url: string) => {
    const assetUrl = getAssetUrl(url, baseDir, assetMap)
    return assetUrl ? `url(${quote}${assetUrl}${quote})` : match
  })

const getAssetUrl = (value: string, baseDir: string, assetMap: AssetMap) => {
  const [pathPart, suffix = ''] = value.split(/([?#].*)/, 2)
  const zipPath = resolveZipPath(pathPart, baseDir)
  if (!zipPath) return null

  const assetUrl = assetMap.get(zipPath)
  return assetUrl ? `${assetUrl}${suffix}` : null
}

const rewriteAttributeUrl = (element: Element, attributeName: string, baseDir: string, assetMap: AssetMap) => {
  const value = element.getAttribute(attributeName)
  if (!value) return

  const assetUrl = getAssetUrl(value, baseDir, assetMap)
  if (assetUrl) element.setAttribute(attributeName, assetUrl)
}

const rewriteSrcSet = (element: Element, baseDir: string, assetMap: AssetMap) => {
  const value = element.getAttribute('srcset')
  if (!value) return

  const rewrittenValue = value
    .split(',')
    .map(item => {
      const trimmedItem = item.trim()
      const [url, ...descriptors] = trimmedItem.split(/\s+/)
      const assetUrl = getAssetUrl(url, baseDir, assetMap)
      return [assetUrl ?? url, ...descriptors].join(' ')
    })
    .join(', ')

  element.setAttribute('srcset', rewrittenValue)
}

const removeExecutableContent = (document: Document) => {
  document.querySelectorAll('script').forEach(script => script.remove())

  document.querySelectorAll('*').forEach(element => {
    Array.from(element.attributes).forEach(attribute => {
      const name = attribute.name.toLowerCase()
      const value = attribute.value.trim().toLowerCase()

      if (name.startsWith('on') || value.startsWith('javascript:')) {
        element.removeAttribute(attribute.name)
      }
    })
  })
}

const buildAssetMap = async (zip: JSZip) => {
  const assetMap: AssetMap = new Map()
  const objectUrls: string[] = []

  await Promise.all(
    Object.values(zip.files).map(async file => {
      if (file.dir || file.name.toLowerCase().endsWith(`/${indexFileName}`) || file.name.toLowerCase() === indexFileName) {
        return
      }

      const path = normalizeZipPath(file.name)
      const bytes = await file.async('uint8array')
      const objectUrl = createObjectUrl(bytes, path)

      assetMap.set(path, objectUrl)
      objectUrls.push(objectUrl)
    })
  )

  return { assetMap, objectUrls }
}

const findIndexFile = (zip: JSZip) =>
  Object.values(zip.files)
    .filter(file => !file.dir && normalizeZipPath(file.name).split('/').pop()?.toLowerCase() === indexFileName)
    .sort((a, b) => normalizeZipPath(a.name).split('/').length - normalizeZipPath(b.name).split('/').length)[0]

const createPreviewHtml = async (file: File) => {
  const zip = await JSZip.loadAsync(file)
  const indexFile = findIndexFile(zip)

  if (!indexFile) {
    throw new Error('压缩包中没有找到 index.html')
  }

  const indexPath = normalizeZipPath(indexFile.name)
  const baseDir = getDirName(indexPath)
  const html = await readTextFile(indexFile)
  const document = new DOMParser().parseFromString(html, 'text/html')
  const { assetMap, objectUrls } = await buildAssetMap(zip)

  removeExecutableContent(document)

  document.querySelectorAll('[style]').forEach(element => {
    const styleValue = element.getAttribute('style')
    if (styleValue) element.setAttribute('style', rewriteCssUrls(styleValue, baseDir, assetMap))
  })

  document.querySelectorAll('img, video, audio, source, track, embed, object').forEach(element => {
    rewriteAttributeUrl(element, 'src', baseDir, assetMap)
    rewriteAttributeUrl(element, 'poster', baseDir, assetMap)
    rewriteAttributeUrl(element, 'data', baseDir, assetMap)
    rewriteSrcSet(element, baseDir, assetMap)
  })

  const bodyHtml = document.body.innerHTML || document.documentElement.innerHTML

  return {
    html: bodyHtml,
    indexPath,
    objectUrls
  }
}

export default function Page() {
  const [status, setStatus] = useState<PreviewState>('idle')
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const [indexPath, setIndexPath] = useState('')
  const [previewHtml, setPreviewHtml] = useState('')
  const objectUrlsRef = useRef<string[]>([])

  const revokeObjectUrls = () => {
    objectUrlsRef.current.forEach(objectUrl => URL.revokeObjectURL(objectUrl))
    objectUrlsRef.current = []
  }

  useEffect(() => revokeObjectUrls, [])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    revokeObjectUrls()
    setPreviewHtml('')
    setIndexPath('')
    setError('')

    if (!file) {
      setFileName('')
      setStatus('idle')
      return
    }

    setFileName(file.name)

    if (!file.name.toLowerCase().endsWith('.zip')) {
      setStatus('error')
      setError('请上传 .zip 压缩包')
      event.target.value = ''
      return
    }

    setStatus('loading')

    try {
      const result = await createPreviewHtml(file)
      objectUrlsRef.current = result.objectUrls
      setPreviewHtml(result.html)
      setIndexPath(result.indexPath)
      setStatus('ready')
    } catch (err) {
      revokeObjectUrls()
      setStatus('error')
      setError(err instanceof Error ? err.message : '解析压缩包失败')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <main className="min-h-[calc(100vh-48px)] bg-zinc-50 text-zinc-950">
      <section className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold">ZIP 网页预览</h1>
            <p className="mt-1 text-sm text-zinc-500">上传包含 index.html 的压缩包，页面会以内联 HTML 方式渲染预览。</p>
          </div>

          <label className="inline-flex cursor-pointer items-center rounded border border-zinc-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-zinc-50">
            选择 ZIP
            <input className="sr-only" type="file" accept=".zip,application/zip" onChange={handleFileChange} />
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-5">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
          <span>
            状态：
            {status === 'idle' ? '等待上传' : status === 'loading' ? '解析中' : status === 'ready' ? '已生成预览' : '解析失败'}
          </span>
          {fileName ? <span>文件：{fileName}</span> : null}
          {indexPath ? <span>入口：{indexPath}</span> : null}
        </div>

        {error ? (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="min-h-[560px] overflow-auto rounded border border-zinc-200 bg-white">
          {status === 'idle' ? (
            <div className="flex min-h-[560px] items-center justify-center px-6 text-center text-sm text-zinc-500">
              请选择一个包含 index.html、图片或视频资源的 ZIP 文件。
            </div>
          ) : null}

          {status === 'loading' ? (
            <div className="flex min-h-[560px] items-center justify-center px-6 text-center text-sm text-zinc-500">
              正在解压并重写资源路径...
            </div>
          ) : null}

          {status === 'ready' ? (
            <div className="zip-preview min-h-[560px]" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          ) : null}

          {status === 'error' ? (
            <div className="flex min-h-[560px] items-center justify-center px-6 text-center text-sm text-zinc-500">
              上传有效 ZIP 后会在这里显示预览。
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
