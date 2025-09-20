'use client'

import { useState } from 'react'
import { Button, Drawer } from 'rmst-design'

export default function DrawerDd() {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <Button onClick={() => setVisible(true)}>open drawer</Button>

      <Drawer
        open={visible}
        onCancel={() => {
          setVisible(false)
        }}
      >
        <div>content</div>
      </Drawer>
    </div>
  )
}
