'use client'

import { initCustomFormatter } from './cc/customFormatter'
import { applyPatches, Draft, enablePatches, Patch, Producer, produceWithPatches } from 'immer'
import { useUpdate } from 'ahooks'
import { PropsWithChildren, Suspense, useState } from 'react'

initCustomFormatter()

enablePatches()

export default function Rmstsd() {
  const update = useUpdate()

  const [manager] = useState(() => {
    const initialState = { count: 0, todos: [], user: { name: 'xxx' } }

    return new UndoRedoManager(initialState)
  })

  console.log(manager)

  return (
    <div className="flex">
      <div>
        <button
          onClick={() => {
            manager.produce(draft => {
              draft.count = draft.count + 1

              draft.count = draft.count - 2

              draft.todos.push(draft.count)
            })

            update()
          }}
        >
          +1
        </button>
        <button
          disabled={!manager.canUndo()}
          onClick={() => {
            manager.undo()
            update()
          }}
        >
          撤销
        </button>
        <button
          disabled={!manager.canRedo()}
          onClick={() => {
            manager.redo()
            update()
          }}
        >
          重做
        </button>
        <button
          onClick={() => {
            manager.clearHistory()
            update()
          }}
        >
          clear
        </button>
        <button
          onClick={() => {
            manager.produce(draft => {
              draft.todos.splice(2, 1)
            })
            update()
          }}
        >
          remove index 2
        </button>
        <button
          onClick={() => {
            manager.produce(draft => {
              draft.user = { name: 'bb' }
            })
            update()
          }}
        >
          update user
        </button>
        <hr />
        <pre>{JSON.stringify(manager.getState(), null, 2)}</pre>
      </div>
    </div>
  )
}

class UndoRedoManager<T extends any> {
  state: T
  patches: Patch[][] = [] // 用于重做
  inversePatches: Patch[][] = [] // 用于撤销
  historyPosition = -1

  constructor(initialState: T) {
    // 初始状态
    this.state = initialState
    // 存储所有的变更补丁
    this.patches = []
    // 存储所有的反补丁（用于撤销）
    this.inversePatches = []
    // 当前历史记录位置
    this.historyPosition = -1
  }

  produce(producer: Producer<T>) {
    // 如果当前不在历史记录的末尾，清除后面的记录
    if (this.historyPosition < this.patches.length - 1) {
      this.patches = this.patches.slice(0, this.historyPosition + 1)
      this.inversePatches = this.inversePatches.slice(0, this.historyPosition + 1)
    }

    // 使用produceWithPatches生成新状态和补丁
    const [newState, newPatches, newInversePatches] = produceWithPatches(this.state, producer)

    // 如果有实际变更才记录
    if (newPatches.length > 0) {
      this.state = newState
      this.patches.push(newPatches)
      this.inversePatches.push(newInversePatches)
      this.historyPosition++
    }

    return this.state
  }

  undo(): boolean {
    if (this.historyPosition < 0) {
      return false // 已经是初始状态，无法撤销
    }

    // 应用反补丁实现撤销
    this.state = applyPatches(this.state, this.inversePatches[this.historyPosition])
    this.historyPosition--
    return true
  }

  redo(): boolean {
    if (this.historyPosition >= this.patches.length - 1) {
      return false // 已经是最新状态，无法重做
    }

    this.historyPosition++
    // 应用补丁实现重做
    this.state = applyPatches(this.state, this.patches[this.historyPosition])
    return true
  }

  getState(): any {
    return this.state
  }

  canUndo(): boolean {
    return this.historyPosition >= 0
  }

  canRedo(): boolean {
    return this.historyPosition < this.patches.length - 1
  }

  clearHistory() {
    this.patches = []
    this.inversePatches = []
    this.historyPosition = -1
  }
}

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项2', value: '6' },
  { label: '选项2', value: '7' },
  { label: '选项2', value: '34' },
  { label: '选项2', value: '255' }
]
