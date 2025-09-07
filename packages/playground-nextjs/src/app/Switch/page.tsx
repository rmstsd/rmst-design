'use client'

import { useState } from 'react'
import { Button, Scrollbar, Switch } from 'rmst-design'

export default function SwitchDd() {
  const [list, setList] = useState(() => Array.from({ length: 10 }, (_, i) => i))
  const [height, setHeight] = useState(100)

  return (
    <div className="">
      <div className="flex items-end gap-2">
        <Switch size="small" />
        <Switch size="default" />
        <Switch size="large" disabled />
        <Switch size="large" disabled value />
      </div>

      <div className="flex items-end gap-2 mt-3">
        <Switch size="default" checkedText="开" unCheckedText="关" />
        <Switch size="default" checkedText="ON" unCheckedText="OFF-OFF-OFF-OFF-OFF-OFF" />
        <Switch size="default" checkedText="1" unCheckedText="0" />
      </div>
    </div>
  )
}
