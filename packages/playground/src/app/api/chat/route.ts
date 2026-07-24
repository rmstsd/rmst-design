import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  createUIMessageStreamResponse,
  toUIMessageStream,
  isStepCount,
  ToolLoopAgent
} from 'ai'
import { createOpenAI, openai } from '@ai-sdk/openai'
import { z } from 'zod'

import { registerTelemetry } from 'ai'
import { DevToolsTelemetry } from '@ai-sdk/devtools'

registerTelemetry(DevToolsTelemetry())

const customOpenAI = createOpenAI({
  baseURL: 'https://api-sp.claudecode.net.cn/api/codex/backend-api/codex',
  apiKey: 'sk-ant-api03--WCOnTXAm7951pVdey-SAhmNORDUEmTR8KGufKCQRLtGOh-nUKUS52U46LEpdUiFIlBMNxsHP7UmYX8WwPRPGA'
})

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: customOpenAI('gpt-5.6-luna'),
    instructions: '你是一个前端开发架构师, 前端开发的你都懂, 在询问你问题的时候, 按步骤给出详细信息和答案,回答的风格是幽默些.',
    messages: await convertToModelMessages(messages),
    providerOptions: {
      openai: {
        store: false
      }
    },
    stopWhen: isStepCount(5),
    tools: {
      // webSearch: openai.tools.webSearch()
      weather: tool({
        description: '获取一个地点的天气（华氏度）',
        inputSchema: z.object({
          location: z.string().describe('获取天气的地点')
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32)
          return {
            location,
            temperature
          }
        }
      }),
      convertFahrenheitToCelsius: tool({
        description: '将一个温度（华氏度）换算为摄氏度',
        inputSchema: z.object({
          temperature: z.number().describe('温度（华氏）换算')
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9))
          return {
            celsius
          }
        }
      })
    },
    toolApproval: {
      weather: 'user-approval'
    }
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream })
  })
}
