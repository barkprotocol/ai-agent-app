import { useState, useRef, useCallback } from "react"
import { SendHorizontal, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  onSubmit: (message: string) => Promise<void>
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const MAX_CHARS = 3000

const MessageInput: React.FC<Props> = ({ onSubmit, onChange }) => {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      if (!value.trim()) return
      try {
        await onSubmit(value)
        setValue("")
      } catch (error) {
        console.error("Error submitting message:", error)
      }
    },
    [value, onSubmit],
  )

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      if (newValue.length <= MAX_CHARS) {
        setValue(newValue)
        onChange(e)
      }
    },
    [onChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col">
      <div className="relative flex w-full">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          className="flex-1 resize-none rounded-lg border border-input bg-background p-4 pr-12 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Message input"
          maxLength={MAX_CHARS}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          disabled={!value.trim()}
          className="group absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          title="Send message"
          aria-label="Send message"
        >
          <SendHorizontal
            className="h-4 w-4 transition-transform duration-200 ease-out group-hover:scale-110"
            aria-hidden="true"
          />
        </Button>
      </div>
      <div className="mt-2 text-right text-xs text-muted-foreground">
        {value.length}/{MAX_CHARS}
      </div>
    </form>
  )
}

export default MessageInput

