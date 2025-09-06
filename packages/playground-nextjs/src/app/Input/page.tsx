'use client'

import { useState } from 'react'
import { Input } from 'rmst-design'

export default function InputDd() {
  const [value, setValue] = useState('')

  return (
    <div className="flex flex-col gap-10">
      <Input size="small" value={value} onChange={setValue} placeholder="small" />
      <Input size="default" placeholder="default" />
      <Input size="large" placeholder="large" />

      <br />

      <Input readOnly value={'readOnly'} placeholder="只读" />
      <Input disabled value={'disabled'} placeholder="禁用" />
      <Input placeholder="请输入" />
      <Input placeholder="请输入" />
    </div>
  )
}
