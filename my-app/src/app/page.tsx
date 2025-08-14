'use client'

import React, { useContext, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { Button, Dialog, DialogTrigger, Heading, Input, Label, Modal, TextField } from 'react-aria-components'
import { Overlay } from '@react-aria/overlays'

import Portal from '@rc-component/portal'

const isServer = typeof window === 'undefined'

const IsSSRContext = React.createContext(false)

function getSnapshot() {
  return false
}

function getServerSnapshot() {
  return true
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function subscribe(onStoreChange: () => void): () => void {
  // noop
  return () => {}
}

export function useIsSSR(): boolean {
  // In React 18, we can use useSyncExternalStore to detect if we're server rendering or hydrating.
  if (typeof React['useSyncExternalStore'] === 'function') {
    return React['useSyncExternalStore'](subscribe, getSnapshot, getServerSnapshot)
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useContext(IsSSRContext)
}

export default function Home() {
  let isSSR = useIsSSR()

  if (isSSR) {
    return null
  }

  console.log(isSSR)

  return createPortal(<div>asdasd</div>, document.body)

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
