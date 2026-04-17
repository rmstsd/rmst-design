'use server'

import { prisma } from '@/lib/prisma'
import type { Prisma, Todo } from '@prisma-client'

export type TodoCreateData = Pick<Prisma.TodoCreateInput, 'title' | 'userId' | 'completed'>

export type TodoUpdateData = Omit<Prisma.TodoUpdateInput, 'createdAt' | 'updatedAt'>

export async function getTodoList() {
  return prisma.todo.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function addTodo(data: TodoCreateData) {
  return prisma.todo.create({ data })
}

export async function toggleTodo(id: Todo['id']) {
  const todo = await prisma.todo.findUnique({ where: { id } })
  if (!todo) return null
  return prisma.todo.update({
    where: { id },
    data: { completed: !todo.completed, updatedAt: new Date() }
  })
}

export async function updateTodo(id: Todo['id'], data: TodoUpdateData) {
  return prisma.todo.update({ where: { id }, data: { ...data, updatedAt: new Date() } })
}

export async function deleteTodo(id: Todo['id']) {
  return prisma.todo.delete({ where: { id } })
}
