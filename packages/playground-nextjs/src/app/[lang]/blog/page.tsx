'use client'

import { Modal } from 'rmst-design'
import Client from './Client'
import { useTranslations } from 'next-intl'

export default function Blog() {
  console.log('Blog render')

  // const p = fetch('http://localhost:1400/test', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ delay: 10, name: '接口' })
  // }).then(res => res.json())

  // const t = useTranslations('HomePage')

  return (
    <div className="">
      {/* <div>{t('title')}</div> */}

      {/* <Client p={p} /> */}

      {/* <Modal>
        <div>Modal content</div>
      </Modal> */}
    </div>
  )
}
