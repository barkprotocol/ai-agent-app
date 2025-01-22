import { Action, type Prisma, type Message as PrismaMessage } from "@prisma/client"
import _ from "lodash"

import prisma from "@/lib/prisma"
import type { NewAction } from "@/app/types/db"
import { debugLog } from "@/lib/utils/debug"

const logger = debugLog.createDebugLogger("DBQueries")

/**
 * Retrieves a conversation by its ID
 */
export async function dbGetConversation(conversationId: string) {
  try {
    return await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { createdAt: "asc" } } }, // Include messages to reduce database calls
    })
  } catch (error) {
    logger("Failed to get conversation", { conversationId, error }, { level: "error" })
    throw new Error(`Failed to get conversation: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Creates a new conversation
 */
export async function dbCreateConversation(conversationId: string, userId: string, title: string) {
  try {
    return await prisma.conversation.create({
      data: { id: conversationId, userId, title },
    })
  } catch (error) {
    logger("Failed to create conversation", { conversationId, userId, error }, { level: "error" })
    throw new Error(`Failed to create conversation: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Creates multiple messages in bulk
 */
export async function dbCreateMessages(messages: Omit<PrismaMessage, "id" | "createdAt">[]) {
  try {
    return await prisma.message.createMany({
      data: messages as Prisma.MessageCreateManyInput[],
    })
  } catch (error) {
    logger("Failed to create messages", { messageCount: messages.length, error }, { level: "error" })
    throw new Error(`Failed to create messages: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Retrieves all messages for a specific conversation
 */
export async function dbGetConversationMessages(conversationId: string) {
  try {
    return await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    })
  } catch (error) {
    logger("Failed to get conversation messages", { conversationId, error }, { level: "error" })
    throw new Error(`Failed to get conversation messages: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Deletes a conversation and all its associated messages and actions
 */
export async function dbDeleteConversation(conversationId: string, userId: string) {
  try {
    return await prisma.$transaction(async (prisma) => {
      await prisma.action.deleteMany({ where: { conversationId } })
      await prisma.message.deleteMany({ where: { conversationId } })
      return prisma.conversation.delete({ where: { id: conversationId, userId } })
    })
  } catch (error) {
    logger("Failed to delete conversation", { conversationId, userId, error }, { level: "error" })
    throw new Error(`Failed to delete conversation: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Retrieves all conversations for a specific user
 */
export async function dbGetConversations(userId: string, page = 1, pageSize = 10) {
  try {
    const [conversations, total] = await prisma.$transaction([
      prisma.conversation.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { _count: { select: { messages: true } } },
      }),
      prisma.conversation.count({ where: { userId } }),
    ])
    return { conversations, total, page, pageSize }
  } catch (error) {
    logger("Failed to get user conversations", { userId, error }, { level: "error" })
    throw new Error(`Failed to get user conversations: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Retrieves all actions that match the specified filters
 */
export async function dbGetActions(
  filters: {
    triggered: boolean
    paused: boolean
    completed: boolean
  },
  page = 1,
  pageSize = 10,
) {
  try {
    const [actions, total] = await prisma.$transaction([
      prisma.action.findMany({
        where: filters,
        orderBy: { createdAt: "desc" },
        include: { user: { include: { wallets: true } } },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.action.count({ where: filters }),
    ])
    return { actions, total, page, pageSize }
  } catch (error) {
    logger("Failed to get actions", { filters, error }, { level: "error" })
    throw new Error(`Failed to get actions: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Creates a new action
 */
export async function dbCreateAction(action: NewAction) {
  try {
    return await prisma.action.create({
      data: {
        ..._.omit(action, "conversationId", "userId"),
        params: action.params as Prisma.JsonObject,
        user: { connect: { id: action.userId } },
        conversation: { connect: { id: action.conversationId } },
      },
    })
  } catch (error) {
    logger("Failed to create action", { action, error }, { level: "error" })
    throw new Error(`Failed to create action: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Creates a new token stat entry
 */
export async function dbCreateTokenStat(data: {
  userId: string
  messageIds: string[]
  totalTokens: number
  promptTokens: number
  completionTokens: number
}) {
  try {
    return await prisma.tokenStat.create({ data })
  } catch (error) {
    logger("Failed to create token stats", { data, error }, { level: "error" })
    throw new Error(`Failed to create token stats: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Retrieves the Telegram ID for a user
 */
export async function dbGetUserTelegramChat(userId: string) {
  try {
    return await prisma.telegramChat.findUnique({
      where: { userId },
      select: { username: true, chatId: true },
    })
  } catch (error) {
    logger("Failed to get user Telegram Chat", { userId, error }, { level: "error" })
    throw new Error(`Failed to get user Telegram Chat: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Updates the Telegram Chat for a user
 */
export async function dbUpdateUserTelegramChat(data: {
  userId: string
  username: string
  chatId?: string
}) {
  try {
    return await prisma.telegramChat.upsert({
      where: { userId: data.userId },
      update: { username: data.username, chatId: data.chatId },
      create: data,
    })
  } catch (error) {
    logger("Failed to update user Telegram Chat", { data, error }, { level: "error" })
    throw new Error(`Failed to update user Telegram Chat: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

