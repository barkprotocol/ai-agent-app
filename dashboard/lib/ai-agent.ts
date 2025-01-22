import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function getAIResponse(messages: { role: string; content: string }[]) {
  const response = streamText({
    model: openai("gpt-4-turbo"),
    messages: messages,
  })

  return response
}

