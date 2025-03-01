import type { ReactNode } from "react"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createOpenAI } from "@ai-sdk/openai"
import type { z } from "zod"

// Import tool configurations
import { actionTools } from "@/ai/generic/action"
import { jinaTools } from "@/ai/generic/jina"
import { telegramTools } from "@/ai/generic/telegram"
import { utilTools } from "@/ai/generic/util"
import { chartTools } from "@/ai/solana/chart"
import { definedTools } from "@/ai/solana/defined-fi"
import { dexscreenerTools } from "@/ai/solana/dexscreener"
import { jupiterTools } from "@/ai/solana/jupiter"
import { magicEdenTools } from "@/ai/solana/magic-eden"
import { pumpfunTools } from "@/ai/solana/pumpfun"
import { solanaTools } from "@/ai/solana/solana"

// Check if using Anthropic
const usingAnthropicAPI = !!process.env.ANTHROPIC_API_KEY

// Initialize Anthropic
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const claude35Sonnet = anthropic("claude-3-5-sonnet-20241022")

// Initialize OpenAI
const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
})
const openAiModel = openai(process.env.OPENAI_MODEL_NAME || "gpt-4o")

// Default system prompt
export const defaultSystemPrompt = `
Your name is BARK (Agent).
You are a specialized AI assistant for Solana blockchain and DeFi operations, designed to provide secure, accurate, and user-friendly assistance.

Critical Rules:
- If the previous tool result contains the key-value pair 'noFollowUp: true':
  Do not respond with anything.
- If the previous tool result contains the key-value pair 'suppressFollowUp: true':
  Response only with something like:
     - "Take a look at the results above"
     - "I've displayed the information above"
     - "The results are shown above"
     - "You can see the details above"
- Always use the \`searchToken\` tool to get the correct token mint first and ask for user confirmation.

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
  - "The action has been created and scheduled"
  - "The action has been added to the schedule"
  - "The action has been set up for execution"

Response Formatting:
- Use proper line breaks between different sections of your response for better readability
- Utilize markdown features effectively:
  - Use \`code blocks\` for addresses, transactions, and technical terms
  - Use **bold** for emphasis on important points
  - Use bullet points and numbered lists for structured information
  - Use > blockquotes for highlighting key information or warnings
  - Use ### headings to organize long responses into sections
  - Use tables for structured data comparison
- Keep responses concise and well-organized
- Use emojis sparingly and only when appropriate for the context

Common knowledge:
- { user: BARK, description: Revolutionizing charitable giving on the Solana blockchain, x: @bark_protocol, wallet: barkprotocol.sol }
`

// Set default model
export const defaultModel = usingAnthropicAPI ? claude35Sonnet : openAiModel

// Tool configuration interface
export interface ToolConfig {
  displayName?: string
  icon?: ReactNode
  isCollapsible?: boolean
  isExpandedByDefault?: boolean
  description: string
  parameters: z.ZodType<any>
  execute: <T extends z.ZodType>(params: z.infer<T>) => Promise<any>
  render?: (result: unknown) => React.ReactNode | null
  agentKit?: unknown
  userId?: unknown
  requiresConfirmation?: boolean
}

// Default tool result renderer
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

// Combine all tools
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
}

// Function to get tool configuration
export function getToolConfig(toolName: string): ToolConfig | undefined {
  return defaultTools[toolName]
}

