import React, { useRef } from "react"
import { Button } from "./Button"
import { ImageIcon, SendHorizontal } from "./Icons"
import { MessageAttachments } from "./MessageAttachments"
import cn from "classnames"

const MemoizedMessageAttachments = React.memo(MessageAttachments)

function ChatMessage({ message, onPreviewImage }) {
  const { input, attachments, isLoading } = message
  const fileInputRef = useRef(null)
  const hasAttachments = message.experimental_attachments?.length > 0

  return (
    <div className="flex h-full flex-col" aria-label="Chat interface">
      {/* rest of code here */}
      {hasAttachments && (
        <div className={cn("w-full max-w-[400px]", message.content && "mb-2")}>
          <MemoizedMessageAttachments
            attachments={message.experimental_attachments!}
            messageId={message.id}
            onPreviewImage={onPreviewImage}
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            aria-label="Upload image"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} multiple />
          {/* rest of code here */}
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={
              (!input.trim() && attachments.length === 0) || isLoading || attachments.some((att) => att.uploading)
            }
            className="h-8 w-8 hover:bg-muted"
            aria-label="Send message"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatMessage

