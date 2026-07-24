'use client'

import { useChat } from '@ai-sdk/react'
import { lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'
import clsx from 'clsx'
import { useState } from 'react'

export default function Chat() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, addToolApprovalResponse } = useChat({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses
  })

  console.log(messages)

  return (
    <div className="flex min-h-screen w-full max-w-md flex-col py-24 mx-auto">
      {messages.map(message => (
        <div key={message.id} className={clsx('whitespace-pre-wrap', message.role === 'user' ? 'text-right' : '')}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return (
                  <div key={`${message.id}-${i}`} className="mt-1 text-xl">
                    {part.text}
                  </div>
                )
              case 'tool-weather':
              case 'tool-convertFahrenheitToCelsius':
                return (
                  <div key={`${message.id}-${i}`}>
                    <div>调用的工具: {part.type}</div>
                    <div>
                      {part.state === 'approval-requested' && !part.approval.isAutomatic && (
                        <button
                          onClick={() => {
                            addToolApprovalResponse({ id: part.approval.id, approved: true })
                          }}
                        >
                          同意
                        </button>
                      )}
                    </div>
                    <div>调用的 input: {JSON.stringify(part.input)}</div>
                    <div>调用的 output: {JSON.stringify(part.output)}</div>
                  </div>
                )
            }
          })}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault()
          sendMessage({ text: input })
          setInput('')
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  )
}
