"use server"

import { type CoreTool, NoSuchToolError, generateObject, generateText } from "ai"
import _ from "lodash"
import { SolanaAgentKit } from "solana-agent-kit"
import type { z } from "zod"

import { defaultModel, defaultSystemPrompt, defaultTools } from "@/ai/providers"
import { RPC_URL } from "@/lib/constants"
import prisma from "@/lib/prisma"
import { decryptPrivateKey } from "@/lib/solana/wallet-generator"
import { sanitizeResponseMessages } from "@/lib/utils/ai"
import type { ActionWithUser } from "@/app/types/db"

import { dbCreateMessages, dbGetConversation } from "@/app/server/db/queries"

export async function processAction(action: ActionWithUser) {
  console.log(`[action:${action.id}] Processing action ${action.id} with prompt "${action.description}"`)

  try {
    const conversation = await dbGetConversation({
      conversationId: action.conversationId,
    })

    if (!conversation) {
      throw new Error(`Conversation ${action.conversationId} not found`)
    }

    const publicKey = action.user.wallets[0].publicKey
    const systemPrompt = `${defaultSystemPrompt}\n\nUser Solana wallet public key: ${publicKey}`

    const privateKey = await decryptPrivateKey(action.user.wallets[0].encryptedPrivateKey)
    const openaiKey = process.env.OPENAI_API_KEY
    if (!openaiKey) {
      throw new Error("OpenAI API key not found")
    }

    const agent = new SolanaAgentKit(privateKey, RPC_URL, openaiKey)

    const tools = _.cloneDeep(defaultTools)
    for (const toolName in tools) {
      const tool = tools[toolName as keyof typeof tools]
      tools[toolName as keyof typeof tools] = {
        ...tool,
        agentKit: agent,
        userId: action.userId,
      }
    }

    // Remove createAction from tools to prevent recursive action creation
    delete tools.createAction

    const { response } = await generateText({
      model: defaultModel,
      system: systemPrompt,
      tools: tools as Record<string, CoreTool<any, any>>,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "stream-text",
      },
      experimental_repairToolCall: async ({ toolCall, tools, parameterSchema, error }) => {
        if (NoSuchToolError.isInstance(error)) {
          return null
        }

        console.log(`[action:${action.id}] repairToolCall`, toolCall)

        const tool = tools[toolCall.toolName as keyof typeof tools]
        const { object: repairedArgs } = await generateObject({
          model: defaultModel,
          schema: tool.parameters as z.ZodType<any>,
          prompt: [
            `The model tried to call the tool "${toolCall.toolName}"` + ` with the following arguments:`,
            JSON.stringify(toolCall.args),
            `The tool accepts the following schema:`,
            JSON.stringify(parameterSchema(toolCall)),
            "Please fix the arguments.",
          ].join("\n"),
        })

        console.log(`[action:${action.id}] repairedArgs`, repairedArgs)
        console.log(`[action:${action.id}] toolCall`, toolCall)

        return { ...toolCall, args: JSON.stringify(repairedArgs) }
      },
      maxSteps: 15,
      prompt: action.description,
    })

    const sanitizedResponses = sanitizeResponseMessages(response.messages)
    await dbCreateMessages({
      messages: sanitizedResponses.map((message) => ({
        conversationId: action.conversationId,
        role: message.role,
        content: JSON.parse(JSON.stringify(message.content)),
      })),
    })

    await updateActionStatus(action, true)
  } catch (error) {
    console.error(`[action:${action.id}] Failed to process action ${action.id}`, error)
    await updateActionStatus(action, false)
  }
}

async function updateActionStatus(action: ActionWithUser, success: boolean) {
  await prisma.action.update({
    where: { id: action.id },
    data: {
      timesExecuted: {
        increment: 1,
      },
      lastExecutedAt: new Date(),
      ...(action.maxExecutions && {
        completed: action.timesExecuted + 1 >= action.maxExecutions,
      }),
      status: success ? "COMPLETED" : "FAILED",
    },
  })
}

