import { NextResponse } from "next/server"
import { z } from "zod"

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }

  const { page, limit } = paginationSchema.parse({
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  })

  const result = await dbGetConversations({
    userId,
    page,
    limit,
  })

  if (!result || !result.conversations) {
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }

  const { conversations, total } = result

  return NextResponse.json({
    data: conversations,
    pagination: {
      page,
      limit,
      total,
    },
  })
}

// Dummy function for demonstration purposes.  Replace with your actual database function.
async function dbGetConversations({ userId, page, limit }: { userId: string; page: number; limit: number }) {
  // Simulate fetching conversations from a database.
  const conversations = Array.from({ length: limit }, (_, i) => ({
    id: (page - 1) * limit + i + 1,
    userId,
    message: `Conversation ${(page - 1) * limit + i + 1}`,
  }))
  const total = 100 // Simulate total number of conversations.
  return { conversations, total }
}

