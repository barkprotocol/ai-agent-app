import type { ReactNode } from "react"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"

import { actionTools } from "./generic/action"
import { jinaTools } from "./generic/jina"
import { telegramTools } from "./generic/telegram"
import { utilTools } from "./generic/util"
import { chartTools } from "./solana/chart"
import { definedTools } from "./solana/defined-fi"
import { dexscreenerTools } from "./solana/dexscreener"
import { jupiterTools } from "./solana/jupiter"
import { magicEdenTools } from "./solana/magic-eden"
import { pumpfunTools } from "./solana/pumpfun"
import { solanaTools } from "./solana/solana"
import { barkTools } from "./solana/bark"

const usingAnthropic = !!process.env.ANTHROPIC_API_KEY

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const claude35Sonnet = anthropic("claude-3-5-sonnet-20241022")

const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
})

export const orchestratorModel = openai("gpt-4o-mini")

const openAiModel = openai(process.env.OPENAI_MODEL_NAME || "gpt-4o")

export const defaultSystemPrompt = `
Your name is BARK (Agent).
You are a specialized AI assistant for Solana blockchain and DeFi operations, with a focus on charitable giving. You are designed to provide secure, accurate, and user-friendly assistance.

Critical Rules:
- If the previous tool result contains the key-value pair 'noFollowUp: true':
  Do not respond with anything.
- If the previous tool result contains the key-value pair 'suppressFollowUp: true':
  Respond only with something like:
     - "Take a look at the results above"
- Always use the \`searchToken\` tool to get the correct token mint first and ask for user confirmation.
- When dealing with charitable donations, always verify the legitimacy of the recipient organization.

Confirmation Handling:
- Before executing any tool where the parameter "requiresConfirmation" is true or the description contains the term "requiresConfirmation":
  1. Always call the \`askForConfirmation\` tool to request explicit user confirmation.
  2. STOP your response immediately after calling \`askForConfirmation\` without providing any additional information or context.
  3. Wait for the user to explicitly confirm or reject the action in a separate response.
- Post-Confirmation Execution:
  - If the user confirms:
    1. Only proceed with executing the tool in a new response after the confirmation.
  - If the user rejects:
    1. Acknowledge the rejection (e.g., "Understood, the action will not be executed").
    2. Do not attempt the tool execution.
- Behavioral Guidelines:
  1. NEVER chain the confirmation request and tool execution within the same response.
  2. NEVER execute the tool without explicit confirmation from the user.
  3. Treat user rejection as final and do not prompt again for the same action unless explicitly instructed.

Scheduled Actions:
- Scheduled actions are automated tasks that are executed at specific intervals.
- These actions are designed to perform routine operations without manual intervention.
- Always ask for confirmation using the \`askForConfirmation\` tool before scheduling any action. Obey the rules outlined in the "Confirmation Handling" section.
- If previous tool result is \`createActionTool\`, response only with something like:
  - "The action has been scheduled successfully"

Charitable Giving Guidelines:
- Always prioritize transparency in charitable transactions.
- Provide clear information about donation allocation and impact.
- Encourage users to verify charitable organizations before donating.
- Offer options for recurring donations when appropriate.

Response Formatting:
- Use proper line breaks between different sections of your response for better readability
- Utilize markdown features effectively to enhance the structure of your response
- Keep responses concise and well-organized
- Use emojis sparingly and only when appropriate for the context
- Use an abbreviated format for transaction signatures

Common knowledge:
- { user: BARK, description: Revolutionizing charitable giving on the Solana blockchain, twitter: @bark_protocol, wallet: BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo }

Realtime knowledge:
- { approximateCurrentTime: ${new Date().toISOString()}}

BARK-specific functions:
- Always use the \`verifyCharity\` tool before processing any charitable donations.
- Use the \`calculateDonationImpact\` tool to provide users with information about the potential impact of their donation.
- When suggesting donation amounts, use the \`suggestDonationAmount\` tool to provide personalized recommendations based on user history and charity needs.
`

export const defaultModel = usingAnthropic ? claude35Sonnet : openAiModel

export interface ToolConfig {
  displayName?: string
  icon?: ReactNode
  isCollapsible?: boolean
  isExpandedByDefault?: boolean
  description: string
  parameters: z.ZodType<any>
  execute?: <T extends z.ZodType>(params: z.infer<T>) => Promise<any>
  render?: (result: unknown) => React.ReactNode | null
  agentKit?: any
  userId?: any
  requiresConfirmation?: boolean
}

export function DefaultToolResultRenderer({ result }: { result: unknown }) {
  if (result && typeof result === "object" && "error" in result) {
    return <div className="mt-2 pl-3.5 text-sm text-destructive">{String((result as { error: unknown }).error)}</div>
  }

  return (
    <div className="mt-2 border-l border-border/40 pl-3.5 font-mono text-xs text-muted-foreground/90">
      <pre className="max-h-[200px] max-w-[400px] truncate whitespace-pre-wrap break-all">
        {JSON.stringify(result, null, 2).trim()}
      </pre>
    </div>
  )
}

export const defaultTools: Record<string, ToolConfig> = {
  ...actionTools,
  ...solanaTools,
  ...definedTools,
  ...pumpfunTools,
  ...jupiterTools,
  ...dexscreenerTools,
  ...magicEdenTools,
  ...jinaTools,
  ...utilTools,
  ...chartTools,
  ...telegramTools,
  ...barkTools,
}

export const coreTools: Record<string, ToolConfig> = {
  ...actionTools,
  ...utilTools,
  ...jinaTools,
}

export const toolsets: Record<string, { tools: string[]; description: string }> = {
  coreTools: {
    tools: ["actionTools", "utilTools", "jupiterTools"],
    description:
      "Core utility tools for general operations, including actions, searching token info, utility functions.",
  },
  webTools: {
    tools: ["jinaTools"],
    description: "Web scraping and content extraction tools for reading web pages and extracting content.",
  },
  defiTools: {
    tools: ["solanaTools", "dexscreenerTools"],
    description:
      "Tools for interacting with DeFi protocols on Solana, including swaps, market data, token definitions.",
  },
  financeTools: {
    tools: ["definedTools"],
    description:
      "Tools for retrieving and applying logic to static financial data, including analyzing trending tokens.",
  },
  tokenLaunchTools: {
    tools: ["pumpfunTools"],
    description: "Tools for launching tokens on PumpFun, including token deployment and management.",
  },
  chartTools: {
    tools: ["chartTools"],
    description: "Tools for generating and displaying various types of charts.",
  },
  nftTools: {
    tools: ["magicEdenTools"],
    description: "Tools for interacting with NFTs, including Magic Eden integrations.",
  },
  barkTools: {
    tools: ["barkTools"],
    description: "Tools for interacting with Donations, payments, NFTs, including Blinks integrations.",
  },
  socialTools: {
    tools: ["telegramTools"],
    description: "Tools for interacting with Telegram for notifications and messaging.",
  },
}

export const orchestrationPrompt = `
You are BARK AI, an AI assistant specialized in Solana blockchain, DeFi operations, and charitable giving.

Your Task:
Analyze the user's message and return the appropriate toolsets as a **JSON array of strings**.  
Each toolset represents a group of tools relevant to the user's request.  

Rules:
- Only return the toolsets in the format: ["toolset1", "toolset2", ...].  
- Do not add any text, explanations, or comments outside the array.  
- Be minimal — include only the toolsets necessary to handle the request.
- Always include "barkTools" when the request involves charitable giving or donations.

Available Tools:
${Object.entries(defaultTools)
  .map(([name, { description }]) => `- **${name}**: ${description}`)
  .join("\n")}
`

export function getToolConfig(toolName: string): ToolConfig | undefined {
  return defaultTools[toolName]
}

export function getToolsFromRequiredTools(toolNames: string[]): Record<string, ToolConfig> {
  return toolNames.reduce((acc: Record<string, ToolConfig>, toolName) => {
    const tool = defaultTools[toolName]
    if (tool) {
      acc[toolName] = tool
    }
    return acc
  }, {})
}

// BARK-specific functions
export function verifyCharity(charityAddress: string): Promise<boolean> {
  // Implementation for verifying a charity's legitimacy
  // This would typically involve checking against a trusted database or API
  return Promise.resolve(true) // Placeholder implementation
}

export function calculateDonationImpact(amount: number, charityAddress: string): Promise<string> {
  // Implementation for calculating the potential impact of a donation
  // This would typically involve querying the charity's data and applying some impact metrics
  return Promise.resolve(`Your donation of ${amount} SOL could provide meals for 100 people.`) // Placeholder implementation
}

export function suggestDonationAmount(userAddress: string, charityAddress: string): Promise<number> {
  // Implementation for suggesting a donation amount based on user history and charity needs
  // This would typically involve analyzing the user's transaction history and the charity's current funding goals
  return Promise.resolve(10) // Placeholder implementation suggesting 10 SOL
}

// Add BARK-specific functions to barkTools
barkTools.verifyCharity = {
  description: "Verify the legitimacy of a charitable organization",
  parameters: z.object({
    charityAddress: z.string().describe("The Solana address of the charity to verify"),
  }),
  execute: async ({ charityAddress }) => await verifyCharity(charityAddress),
}

barkTools.calculateDonationImpact = {
  description: "Calculate the potential impact of a donation",
  parameters: z.object({
    amount: z.number().describe("The amount of the donation in SOL"),
    charityAddress: z.string().describe("The Solana address of the charity"),
  }),
  execute: async ({ amount, charityAddress }) => await calculateDonationImpact(amount, charityAddress),
}

barkTools.suggestDonationAmount = {
  description: "Suggest a donation amount based on user history and charity needs",
  parameters: z.object({
    userAddress: z.string().describe("The Solana address of the user"),
    charityAddress: z.string().describe("The Solana address of the charity"),
  }),
  execute: async ({ userAddress, charityAddress }) => await suggestDonationAmount(userAddress, charityAddress),
}

