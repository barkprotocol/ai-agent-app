import type React from "react"
import { useCallback, useRef, useState } from "react"
import { Textarea } from "./textarea"
import { toast } from "react-hot-toast"

const MAX_CHARS = 2000

const MessageInput = ({ onSubmit }: { onSubmit: (message: string) => Promise<void> }) => {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const characterCount = value.length

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      if (!value.trim()) return
      try {
        await onSubmit(value)
        setValue("") // Clear the input after successful submission
        textareaRef.current?.focus() //Refocus on textarea
      } catch (error) {
        console.error("Error submitting message:", error)
        toast.error("Failed to send message. Please try again.")
      }
    },
    [value, onSubmit],
  )

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        maxLength={MAX_CHARS}
        placeholder="Start a new conversation..."
        className="min-h-[110px] w-full resize-none overflow-hidden border-0 bg-transparent px-4 py-3 text-base focus-visible:ring-0"
        aria-label="Conversation input"
        aria-invalid={value.length > MAX_CHARS}
      />
      <div className="flex justify-between items-center mt-2">
        <span
          className={`text-xs ${value.length > MAX_CHARS ? "text-destructive" : "text-muted-foreground"}`}
          aria-live="polite"
        >
          {characterCount}/{MAX_CHARS}
        </span>
        <button type="submit" className="text-primary-500 hover:underline">
          Send
        </button>
      </div>
    </form>
  )
}

export default MessageInput

