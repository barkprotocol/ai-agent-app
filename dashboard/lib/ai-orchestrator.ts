import { createOpenAI } from "@ai-sdk/openai"

// Define the type for the tool names
type ToolName = string

// Define the type for the orchestrator function
type OrchestratorFunction = (request: string) => Promise<ToolName[]>

export const orchestrationPrompt = `
You are an AI orchestrator. Your task is to analyze the user's request and determine which tools are needed to fulfill it.
Please return an array of tool names that will be required to handle the user's request.
`

// Ensure the API key is available
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in the environment variables")
}

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const orchestratorModel = openai("gpt-3.5-turbo")

export const orchestrator: OrchestratorFunction = async (request: string) => {
  try {
    const response = await orchestratorModel.generateText({
      prompt: `${orchestrationPrompt}\n\nUser request: ${request}`,
      max_tokens: 100,
    })

    // Parse the response to extract tool names
    const toolNames = JSON.parse(response.text) as ToolName[]
    return toolNames
  } catch (error) {
    console.error("Error in AI orchestrator:", error)
    throw new Error("Failed to orchestrate tools for the request")
  }
}

