import type { CoreTool } from "ai"
import { openai } from "@ai-sdk/openai"

export const defaultModel = openai("gpt-4-turbo")

export const defaultSystemPrompt = `You are BARK AI, a helpful AI assistant focused on Solana blockchain and DeFi.
You can help users with trading, portfolio management, and blockchain interactions.
Always provide accurate and helpful information while maintaining a professional tone.`

interface ToolConfig {
  displayName: string
  description: string
  parameters: Record<string, any>
}

const toolConfigs: Record<string, ToolConfig> = {
  askForConfirmation: {
    displayName: "Confirmation Required",
    description: "Request user confirmation before proceeding",
    parameters: {
      message: {
        type: "string",
        description: "Message to display to the user",
      },
    },
  },
  // Add other tool configs as needed
}

export const defaultTools: Record<string, CoreTool<any, any>> = {
  askForConfirmation: {
    name: "askForConfirmation",
    description: "Request user confirmation before proceeding with an action",
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Message to display to the user",
        },
      },
      required: ["message"],
    },
    execute: async ({ message }) => {
      return { message }
    },
  },
  // Add other tools as needed
}

export function getToolConfig(toolName: string): ToolConfig | undefined {
  return toolConfigs[toolName]
}

