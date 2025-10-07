'use client'

import Image from 'next/image'
import lyy from '@/assets/lyy.jpg'

import DockLayout, { LayoutData, LayoutBase, TabBase, TabData, DropDirection } from 'rc-dock'
import 'rc-dock/dist/rc-dock.css'

import { Locale } from 'next-intl'
import { useEffect, useState } from 'react'

function Child() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('child mounted')
  }, [])

  return (
    <div>
      <div>child</div>
      <button onClick={() => setCount(count + 1)}>count: {count}</button>
    </div>
  )
}

const defaultLayout: LayoutData = {
  dockbox: {
    mode: 'horizontal',
    children: [
      {
        tabs: [{ id: 'tab1', title: 'tab1', content: <div>Hello World</div> }]
      },
      {
        tabs: [{ id: 'tab2', title: 'tab2', content: <Child /> }]
      }
    ]
  }
}

export default function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  return (
    <div className="p-4 relative" style={{ height: 400 }}>
      <DockLayout
        dropMode="edge"
        defaultLayout={defaultLayout}
        style={{
          position: 'absolute',
          left: 10,
          top: 10,
          right: 10,
          bottom: 10
        }}
      />

      {/* <center>{dict.title}</center> */}
      {/* <Counter dict={dict} /> */}
      {/* <Image src={user.picture.large} width={100} height={100} alt="" /> */}
      {/* <Image src={lyy} alt="" style={{ objectFit: 'cover', width: 100, height: 100 }} />

      <div className="relative" style={{ width: 400, aspectRatio: 1.5 }}>
        <Image src="/lyy.jpg" alt="" fill style={{ objectFit: 'cover' }} decoding="async" />
      </div> */}
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </div>
  )
}
