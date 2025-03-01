"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import Image from "next/image"
import { useChat } from "ai/react"
import { RiTwitterXFill } from "@remixicon/react"
import { CheckCircle2, ImageIcon, Loader2, SendHorizontal, X } from "lucide-react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

import { getToolConfig } from "@/ai/providers"
import { Confirmation } from "@/components/confirmation"
import { FloatingWallet } from "@/components/floating-wallet"
import { Logo } from "@/components/ui/layout/logo"
import { ToolResult } from "@/components/message/tool-result"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import usePolling from "@/hooks/use-polling"
import { useWalletPortfolio } from "@/hooks/use-wallet-portfolio"
import { uploadImage } from "@/lib/utils/upload"
import { cn } from "@/lib/utils"
import { ChatSkeleton } from "./chat-skeleton"
import MessageInput from "@/components/message-input"
import {
  type Message,
  DBMessage,
  Conversation,
  type ToolInvocation,
  //ToolResult,
  type ToolUpdate,
  type ImagePreview,
  type UploadingImage,
  type ChatInterfaceProps,
} from "@/app/types/chat"

const MAX_CHARS = 2000
const MAX_VISIBLE_ATTACHMENTS = 4
const MAX_JSON_LINES = 20

const truncateJson = (json: unknown): string => {
  const formatted = JSON.stringify(json, null, 2)
  const lines = formatted.split("\n")

  if (lines.length <= MAX_JSON_LINES) {
    return formatted
  }

  const firstHalf = lines.slice(0, MAX_JSON_LINES / 2)
  const lastHalf = lines.slice(-MAX_JSON_LINES / 2)

  return [...firstHalf, "    ...", ...lastHalf].join("\n")
}

const getGridLayout = (count: number) => {
  if (count === 1) return "grid-cols-1"
  if (count === 2) return "grid-cols-2"
  if (count <= 4) return "grid-cols-2 grid-rows-2"
  return "grid-cols-3 grid-rows-2"
}

const getImageStyle = (index: number, total: number) => {
  if (total === 1) return "aspect-square max-w-[300px]"
  if (total === 2) return "aspect-square"
  if (total === 3 && index === 0) return "col-span-2 aspect-[2/1]"
  return "aspect-square"
}

const applyToolUpdates = (messages: Message[], toolUpdates: ToolUpdate[]) => {
  return messages.map((msg) => {
    if ((msg as any).toolInvocations) {
      ;(msg as any).toolInvocations = (msg as any).toolInvocations.map((tool: ToolInvocation) => {
        const update = toolUpdates.find((u) => u.toolCallId === tool.toolCallId)
        if (update && update.type === "tool-update") {
          return {
            ...tool,
            result: {
              ...tool.result,
              result: update.result,
            },
          }
        }
        return tool
      })
    }
    return msg
  })
}

interface MessageAttachmentsProps {
  attachments: Message["experimental_attachments"]
  messageId: string
  onPreviewImage: (preview: ImagePreview) => void
}

function MessageAttachments({ attachments, messageId, onPreviewImage }: MessageAttachmentsProps) {
  const validAttachments =
    attachments?.filter(
      (attachment): attachment is Required<Attachment> =>
        typeof attachment.contentType === "string" &&
        typeof attachment.url === "string" &&
        typeof attachment.name === "string" &&
        attachment.contentType.startsWith("image/"),
    ) || []

  if (validAttachments.length === 0) return null

  return (
    <div className={cn("grid w-full gap-1.5", getGridLayout(validAttachments.length))}>
      {validAttachments.slice(0, MAX_VISIBLE_ATTACHMENTS).map((attachment, index) => (
        <div
          key={`${messageId}-${index}`}
          className={cn(
            "group relative cursor-zoom-in overflow-hidden",
            getImageStyle(index, validAttachments.length),
            "rounded-lg shadow-sm transition-shadow duration-200 hover:shadow-md",
          )}
          onClick={() =>
            onPreviewImage({
              src: attachment.url,
              alt: attachment.name,
              index,
              attachments: validAttachments,
            })
          }
        >
          <Image
            src={attachment.url || "/placeholder.svg"}
            alt={attachment.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {validAttachments.length > MAX_VISIBLE_ATTACHMENTS && index === 3 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-medium text-white">
              +{validAttachments.length - MAX_VISIBLE_ATTACHMENTS}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function MessageToolInvocations({
  toolInvocations,
  addToolResult,
}: {
  toolInvocations: ToolInvocation[]
  addToolResult: (result: any) => void
}) {
  return (
    <div className="space-y-px">
      {toolInvocations.map(({ toolCallId, toolName, displayName, result, state, args }) => {
        const toolResult = result as any
        if (toolName === "askForConfirmation") {
          return (
            <div key={toolCallId} className="group">
              <Confirmation
                message={args?.message}
                result={toolResult?.result}
                toolCallId={toolCallId}
                addResultUtility={(result) =>
                  addToolResult({
                    toolCallId,
                    result: { result, message: args?.message },
                  })
                }
              />
            </div>
          )
        }
        const isCompleted = result !== undefined
        const isError = isCompleted && typeof result === "object" && result !== null && "error" in result
        const config = getToolConfig(toolName)!
        const finalDisplayName = displayName || config.displayName

        const header = (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full ring-2",
                isCompleted
                  ? isError
                    ? "bg-destructive ring-destructive/20"
                    : "bg-emerald-500 ring-emerald-500/20"
                  : "animate-pulse bg-amber-500 ring-amber-500/20",
              )}
            />
            <span className="truncate text-xs font-medium text-foreground/90">{finalDisplayName}</span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground/70">{toolCallId.slice(0, 9)}</span>
          </div>
        )

        return (
          <div key={toolCallId} className="group">
            {isCompleted ? (
              <ToolResult toolName={toolName} result={result} header={header} />
            ) : (
              <>
                {header}
                <div className="mt-px px-3">
                  <div className="h-20 animate-pulse rounded-lg bg-muted/40" />
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

interface ChatMessageProps {
  message: Message
  index: number
  messages: Message[]
  onPreviewImage: (preview: ImagePreview) => void
  addToolResult: (result: any) => void
}

function ChatMessage({ message, index, messages, onPreviewImage, addToolResult }: ChatMessageProps) {
  const isUser = message.role === "user"
  const hasAttachments = message.experimental_attachments && message.experimental_attachments.length > 0
  const showAvatar = !isUser && (index === 0 || messages[index - 1].role === "user")
  const isConsecutive = index > 0 && messages[index - 1].role === message.role

  const processedContent = message.content?.replace(
    /!\[(.*?)\]$$(.*?)\s+=(\d+)x(\d+)$$/g,
    (_, alt, src, width, height) => `![${alt}](${src}#size=${width}x${height})`,
  )

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
        isConsecutive ? "mt-2" : "mt-6",
        index === 0 && "mt-0",
      )}
    >
      {showAvatar ? (
        <Avatar className="mt-0.5 h-8 w-8 shrink-0 select-none">
          <Logo />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      ) : !isUser ? (
        <div className="w-8" aria-hidden="true" />
      ) : null}

      <div className={cn("relative flex max-w-[85%] flex-col gap-2", isUser ? "items-end" : "items-start")}>
        {hasAttachments && (
          <div className={cn("w-full max-w-[400px]", message.content && "mb-2")}>
            <MessageAttachments
              attachments={message.experimental_attachments}
              messageId={message.id}
              onPreviewImage={onPreviewImage}
            />
          </div>
        )}

        {message.content && (
          <div
            className={cn(
              "relative flex flex-col gap-2 rounded-2xl px-4 py-3 text-sm shadow-sm",
              isUser ? "bg-primary" : "bg-muted/60",
            )}
          >
            <div
              className={cn(
                "prose max-w-none leading-tight",
                isUser ? "prose-invert dark:prose-neutral" : "prose-neutral dark:prose-invert",
              )}
            >
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                  img: ({ node, alt, src, ...props }) => {
                    if (!src) return null

                    try {
                      const url = new URL(src, "http://dummy.com")
                      const size = url.hash.match(/size=(\d+)x(\d+)/)

                      if (size) {
                        const [, width, height] = size
                        url.hash = ""
                        return (
                          <Image
                            src={url.pathname + url.search || "/placeholder.svg"}
                            alt={alt || ""}
                            width={Number(width)}
                            height={Number(height)}
                            className="inline-block align-middle"
                          />
                        )
                      }
                    } catch (e) {
                      console.warn("Failed to parse image URL:", e)
                    }

                    const thumbnailPattern = /_thumb\.(png|jpg|jpeg|gif)$/i
                    const isThumbnail = thumbnailPattern.test(src)

                    const width = isThumbnail ? 40 : 500
                    const height = isThumbnail ? 40 : 300

                    return (
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={alt || ""}
                        width={width}
                        height={height}
                        className="inline-block align-middle"
                      />
                    )
                  },
                }}
              >
                {processedContent}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {(message as any).toolInvocations && (
          <MessageToolInvocations toolInvocations={(message as any).toolInvocations} addToolResult={addToolResult} />
        )}
      </div>
    </div>
  )
}

function AttachmentPreview({ attachment, onRemove }: { attachment: UploadingImage; onRemove: () => void }) {
  return (
    <div className="group relative h-16 w-16 shrink-0">
      <Image
        src={attachment.localUrl || "/placeholder.svg"}
        alt={attachment.name ?? "Attached image"}
        fill
        className="rounded-lg border object-cover"
      />
      {attachment.uploading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 shadow-sm backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-background"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

function ImagePreviewDialog({ previewImage, onClose }: { previewImage: ImagePreview | null; onClose: () => void }) {
  if (!previewImage) return null

  const slides = previewImage.attachments
    ? previewImage.attachments.map((attachment) => ({
        src: attachment.url,
        alt: attachment.name,
      }))
    : [{ src: previewImage.src, alt: previewImage.alt }]

  const isSingleImage = slides.length === 1

  return (
    <Lightbox
      open={!!previewImage}
      close={onClose}
      index={previewImage.index || 0}
      slides={slides}
      controller={{ closeOnBackdropClick: true }}
      styles={{
        container: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
        },
        button: {
          filter: "none",
          color: "white",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(4px)",
        },
        navigationPrev: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(4px)",
          borderRadius: "9999px",
          margin: "0 8px",
          display: isSingleImage ? "none" : undefined,
        },
        navigationNext: {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(4px)",
          borderRadius: "9999px",
          margin: "0 8px",
          display: isSingleImage ? "none" : undefined,
        },
      }}
      animation={{ fade: 300 }}
      carousel={{ finite: false }}
      toolbar={{
        buttons: [
          <button
            key="close"
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 backdrop-blur-xl transition-all duration-200 hover:bg-white/20"
            aria-label="Close preview"
          >
            <X className="h-5 w-5 text-white" />
          </button>,
        ],
      }}
      render={{
        buttonPrev: () => null,
        buttonNext: () => null,
        buttonClose: () => null,
      }}
    />
  )
}

function LoadingMessage() {
  return (
    <div className="flex w-full items-start gap-3">
      <Avatar className="mt-0.5 h-8 w-8 shrink-0 select-none">
        <Logo />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>

      <div className="relative flex max-w-[85%] flex-col items-start gap-2">
        <div className="relative flex flex-col gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-sm shadow-sm">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50" />
          </div>
        </div>
      </div>
    </div>
  )
}

function useImageUpload() {
  const [attachments, setAttachments] = useState<UploadingImage[]>([])

  const handleImageUpload = useCallback(async (file: File) => {
    const localUrl = URL.createObjectURL(file)
    const newAttachment: UploadingImage = {
      url: localUrl,
      name: file.name,
      contentType: file.type,
      localUrl,
      uploading: true,
    }

    setAttachments((prev) => [...prev, newAttachment])

    try {
      const url = await uploadImage(file)
      if (!url) throw new Error("Failed to upload image")

      setAttachments((prev) => prev.map((att) => (att.localUrl === localUrl ? { ...att, url, uploading: false } : att)))
    } catch (error) {
      console.error("Failed to upload image:", error)
      setAttachments((prev) => prev.filter((att) => att.localUrl !== localUrl))
    } finally {
      URL.revokeObjectURL(localUrl)
    }
  }, [])

  const removeAttachment = useCallback((localUrl: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((att) => att.localUrl === localUrl)
      if (attachment) {
        URL.revokeObjectURL(attachment.localUrl)
      }
      return prev.filter((att) => att.localUrl !== localUrl)
    })
  }, [])

  useEffect(() => {
    return () => {
      attachments.forEach((att) => {
        if (att.uploading) {
          URL.revokeObjectURL(att.localUrl)
        }
      })
    }
  }, [attachments])

  return {
    attachments,
    setAttachments,
    handleImageUpload,
    removeAttachment,
  }
}

export default function ChatInterface({ id, initialMessages, conversation }: ChatInterfaceProps) {
  const {
    messages: chatMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    addToolResult,
    data,
    setMessages,
  } = useChat({
    id,
    maxSteps: 10,
    initialMessages,
    sendExtraMessageFields: true,
    body: { id },
    onFinish: () => {
      window.history.replaceState({}, "", `/chat/${id}`)
      refresh()
    },
    experimental_prepareRequestBody: ({ messages }) => {
      return {
        message: messages[messages.length - 1],
        id,
      }
    },
  })

  const messages = useMemo(() => {
    const toolUpdates = data as unknown as ToolUpdate[]
    if (!toolUpdates || toolUpdates.length === 0) {
      return chatMessages
    }

    const updatedMessages = applyToolUpdates(chatMessages, toolUpdates)

    return updatedMessages
  }, [chatMessages, data])

  usePolling({
    url: `/api/chat/${id}`,
    id,
    onUpdate: (data: Message[]) => {
      if (!data) {
        return
      }

      if (data && data.length) {
        setMessages(data)
      }
    },
  })

  const [previewImage, setPreviewImage] = useState<ImagePreview | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { attachments, setAttachments, handleImageUpload, removeAttachment } = useImageUpload()
  const { data: portfolio, isLoading: isPortfolioLoading, refresh } = useWalletPortfolio()

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return

      await Promise.all(files.map(handleImageUpload))

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [handleImageUpload],
  )

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const items = Array.from(e.clipboardData.items)
      const imageFiles = items
        .filter((item) => item.type.startsWith("image/"))
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null)

      await Promise.all(imageFiles.map(handleImageUpload))
    },
    [handleImageUpload],
  )

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && attachments.length === 0) return
    if (attachments.some((att) => att.uploading)) return

    const currentAttachments = attachments.map(({ url, name, contentType }) => ({
      url,
      name,
      contentType,
    }))
    setAttachments([])
    await handleSubmit(e, { experimental_attachments: currentAttachments })
    scrollToBottom()
  }

  useEffect(() => {
    document.body.classList.remove("animate-fade-out")
    document.body.classList.add("animate-fade-in")
    const timer = setTimeout(() => {
      document.body.classList.remove("animate-fade-in")
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex h-full flex-col">
      <div className="no-scrollbar relative flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl">
          <div className="space-y-4 px-4 pb-36 pt-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                index={index}
                messages={messages}
                onPreviewImage={setPreviewImage}
                addToolResult={addToolResult}
              />
            ))}
            {isLoading && messages.length === 0 && <ChatSkeleton />}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && <LoadingMessage />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-10">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/95 to-background/0" />
        <div className="relative mx-auto w-full max-w-3xl px-4 py-4">
          {portfolio && <FloatingWallet data={portfolio} isLoading={isPortfolioLoading} />}
          <MessageInput
            onSubmit={async (message) => {
              const currentAttachments = attachments.map(({ url, name, contentType }) => ({
                url,
                name,
                contentType,
              }))
              setAttachments([])
              await handleSubmit(new Event("submit") as any, { message, experimental_attachments: currentAttachments })
              scrollToBottom()
            }}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <ImagePreviewDialog previewImage={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  )
}

