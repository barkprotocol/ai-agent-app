export const EVENTS = {
  ACTION_CREATED: "action:created",
  ACTION_UPDATED: "action:updated",
  ACTION_DELETED: "action:deleted",
  ACTION_COMPLETED: "action:completed",
  ACTION_FAILED: "action:failed",
} as const

export type ActionEvent = (typeof EVENTS)[keyof typeof EVENTS]

