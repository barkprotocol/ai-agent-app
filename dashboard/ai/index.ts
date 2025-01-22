import { tool, type CoreTool } from "ai"
import type { SolanaAgentKit } from "@/app/agent"
import { executeAction } from "../utils/actionExecutor"
import { ACTIONS } from "@/app/actions"

export function createSolanaTools(solanaAgentKit: SolanaAgentKit): Record<string, CoreTool> {
  const tools: Record<string, CoreTool> = {}
  const actionKeys = Object.keys(ACTIONS)

  for (const key of actionKeys) {
    const action = ACTIONS[key as keyof typeof ACTIONS]
    tools[key] = tool({
      id: action.name,
      description: `
      ${action.description}

      Similes: ${action.similes.map(
        (simile) => `
        ${simile}
      `,
      )}
      `
        .trim()
        .slice(0, 1023),
      parameters: action.schema,
      execute: async (params) => await executeAction(action, solanaAgentKit, params),
    })
  }

  return tools
}

