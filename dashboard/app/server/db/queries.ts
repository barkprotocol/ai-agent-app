import prisma from "@/lib/prisma"
import type { Action } from "@prisma/client"

export async function dbGetActions(filters: {
  triggered: boolean
  completed: boolean
  paused: boolean
}): Promise<Action[]> {
  return prisma.action.findMany({
    where: filters,
  })
}

