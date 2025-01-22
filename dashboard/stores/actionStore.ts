import { create } from "zustand"

interface Action {
  id: string
  type: string
  status: "pending" | "completed" | "failed"
}

interface ActionStore {
  actionCount: number
  actions: Action[]
  incrementCount: () => void
  resetCount: () => void
  setCount: (count: number) => void
  refreshTrigger: number
  triggerRefresh: () => void
  addAction: (action: Action) => void
  updateActionStatus: (id: string, status: Action["status"]) => void
}

export const useActionStore = create<ActionStore>((set) => ({
  actionCount: 0,
  actions: [],
  incrementCount: () => set((state) => ({ actionCount: state.actionCount + 1 })),
  resetCount: () => set({ actionCount: 0 }),
  setCount: (count: number) => set({ actionCount: count }),
  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
  addAction: (action: Action) => set((state) => ({ actions: [...state.actions, action] })),
  updateActionStatus: (id: string, status: Action["status"]) =>
    set((state) => ({
      actions: state.actions.map((action) => (action.id === id ? { ...action, status } : action)),
    })),
}))

