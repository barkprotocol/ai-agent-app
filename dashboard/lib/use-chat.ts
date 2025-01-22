import { useCallback, useState } from "react"
import type { Attachment } from "./types"

interface UseMessageInputProps {
  append: (message: string) => void
  onFinish?: () => void
  sendExtraMessageFields?: (fields: any) => void
  initialMessages?: string[]
}

const useMessageInput = ({ append, onFinish, sendExtraMessageFields, initialMessages = [] }: UseMessageInputProps) => {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }, [])

  const addToolResult = useCallback((result: any) => {
    setData(result)
  }, [])

  const handleSubmit = useCallback(
    async (
      e: React.FormEvent,
      { message, experimental_attachments }: { message: string; experimental_attachments?: Attachment[] },
    ) => {
      e.preventDefault()

      if (!message.trim() && (!experimental_attachments || experimental_attachments.length === 0)) return

      setIsLoading(true)
      try {
        await append(message)
        setInput("")
        if (sendExtraMessageFields) {
          sendExtraMessageFields({})
        }
        if (onFinish) {
          onFinish()
        }
      } catch (error) {
        console.error("Error sending message:", error)
        // Handle error appropriately, e.g., display an error message to the user
      } finally {
        setIsLoading(false)
      }
    },
    [append, input, setInput, setIsLoading, onFinish, sendExtraMessageFields],
  )

  return {
    messages,
    input,
    handleSubmit,
    handleInputChange,
    isLoading,
    addToolResult,
    data,
    setMessages,
  }
}

export default useMessageInput

