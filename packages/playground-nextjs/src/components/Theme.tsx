'use client'

import clsx from 'clsx'
import Script from 'next/script'
import { createContext, Fragment, PropsWithChildren, use, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export const ThemeProvider = (props: PropsWithChildren) => {
  const [theme, _setTheme] = useState('light')

  const setTheme = (theme: 'dark' | 'light') => {
    localStorage.setItem('theme', theme)
    _setTheme(theme)
    document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark')
    document.documentElement.classList.add(theme)
  }

  useEffect(() => {
    const theme = localStorage.getItem('theme') ?? 'light'

    // const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    _setTheme(theme)
  }, [])

  return (
    <ThemeContext value={{ theme, setTheme }}>
      {/* <Script id="rmst-theme" strategy="beforeInteractive">
        {`
          // const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          const theme = localStorage.getItem('theme') ?? 'light'
          document.documentElement.classList.add(theme)
        `}
      </Script> */}

      <script
        dangerouslySetInnerHTML={{
          __html: `
            // const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
              const theme = localStorage.getItem('theme') ?? 'light'
              document.documentElement.classList.add(theme)
        `
        }}
      />

      {props.children}
    </ThemeContext>
  )
}

export const SelectTheme = () => {
  const { theme, setTheme } = use(ThemeContext)

  return (
    <div className="ml-4 flex gap-4">
      <div
        className={clsx('dark-icon cursor-pointer')}
        onClick={() => {
          setTheme('dark')
        }}
      >
        dark
      </div>
      <div
        className={clsx('light-icon cursor-pointer')}
        onClick={() => {
          setTheme('light')
        }}
      >
        light
      </div>
    </div>
  )
}
