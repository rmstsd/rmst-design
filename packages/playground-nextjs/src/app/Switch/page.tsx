'use client'

import { useState } from 'react'
import { Button, Scrollbar, Switch } from 'rmst-design'

export default function SwitchDd() {
  const [list, setList] = useState(() => Array.from({ length: 10 }, (_, i) => i))
  const [height, setHeight] = useState(100)

  return (
    <div>
      <Switch />
    </div>
  )
}
