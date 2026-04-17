'use client'

import { useState } from 'react'
import { Button, Input } from 'rmst-design'
import { addTodo } from '@/actions/todo'
import type { TodoCreateData } from '@/actions/todo'

const getDefaultTodoItem = (): TodoCreateData => ({ title: '', userId: '' })
export default function Page() {
  const [todoItem, setTodoItem] = useState<TodoCreateData>(() => getDefaultTodoItem())

  const handleCreate = async () => {
    if (!todoItem.title.trim() || !todoItem.userId.trim()) return
    await addTodo({ title: todoItem.title.trim(), userId: todoItem.userId.trim() })
    setTodoItem(getDefaultTodoItem())
  }

  return (
    <div className="p-2">
      <h1>todo create</h1>
      <div className="flex gap-2 items-end">
        <div>
          <div>title</div>
          <Input placeholder="title" value={todoItem.title} onChange={v => setTodoItem({ ...todoItem, title: v })} />
        </div>
        <div>
          <div>userId</div>
          <Input placeholder="userId" value={todoItem.userId} onChange={v => setTodoItem({ ...todoItem, userId: v })} />
        </div>
        <Button onClick={handleCreate}>创建</Button>
      </div>
    </div>
  )
}
