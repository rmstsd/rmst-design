'use client'

import { Button, Modal } from 'rmst-design'
import Client from './Client'
import { useTranslations } from 'next-intl'
import { useEffectEvent, useState } from 'react'

export default function Blog() {
  console.log('Blog render')

  // const p = fetch('http://localhost:1400/test', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ delay: 10, name: '接口' })
  // }).then(res => res.json())

  // const t = useTranslations('HomePage')

  const [count, setCount] = useState(0)

  // console.log('--', useEffectEvent)

  // useEffectEvent(() => {
  //   console.log('Blog useEffectEvent')
  // })

  return (
    <div className="">
      <Button onClick={() => setCount(count + 1)}>{count}</Button>

      {/* <div>{t('title')}</div> */}

      {/* <Client p={p} /> */}

      {/* <Modal>
        <div>Modal content</div>
      </Modal> */}
    </div>
  )
}
