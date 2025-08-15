'use client'

import React, { useContext, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { Button, Dialog, DialogTrigger, Heading, Input, Label, Modal, TextField } from 'react-aria-components'
import { Overlay } from '@react-aria/overlays'
import { Button as AntdButton } from 'antd'
import { Flex, Slider, Switch, Typography } from 'antd'
import Portal from '@rc-component/portal'

const isServer = typeof window === 'undefined'

export default function Home() {
  const [rows, setRows] = useState(2)
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <Flex gap={16} vertical>
        <Flex gap={16} align="center">
          <Switch checked={expanded} onChange={() => setExpanded(c => !c)} style={{ flex: 'none' }} />
          <Slider min={1} max={20} value={rows} onChange={setRows} style={{ flex: 'auto' }} />
        </Flex>

        <Typography.Paragraph
          ellipsis={{
            rows,
            expandable: 'collapsible',
            expanded,
            onExpand: (_, info) => setExpanded(info.expanded)
          }}
          copyable
        >
          {'Ant Design, a design language for background applications, is refined by Ant UED Team.'.repeat(20)}
        </Typography.Paragraph>
      </Flex>
    </div>
  )

  return (
    <div className="bg-pink-200">
      <div>asdas</div>

      <Overlay>
        <div>股份回购非凡哥</div>
      </Overlay>

      {/* <DialogTrigger>
        <Button>Sign up…</Button>

        <Modal isOpen style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Dialog>
            <form>
              <Heading slot="title">Sign up</Heading>
              <TextField autoFocus>
                <Label>First Name:</Label>
                <Input />
              </TextField>
              <TextField>
                <Label>Last Name:</Label>
                <Input />
              </TextField>
              <Button slot="close">Submit</Button>
            </form>
          </Dialog>
        </Modal>
      </DialogTrigger> */}
    </div>
  )
}
