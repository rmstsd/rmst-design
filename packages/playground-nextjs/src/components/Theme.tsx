import Script from 'next/script'
import { Fragment, PropsWithChildren } from 'react'

export default function Theme(props: PropsWithChildren) {
  return (
    <Fragment>
      <Script id="rmst-theme" strategy="beforeInteractive">
        {`
          const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          document.documentElement.classList.add('dark')
        `}
      </Script>

      {/* <script
        dangerouslySetInnerHTML={{
          __html: `
            const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
            document.documentElement.classList.add('dark')
        `
        }}
      ></script> */}

      {props.children}
    </Fragment>
  )
}
