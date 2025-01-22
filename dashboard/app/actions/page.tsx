import { ActionCreator } from "@/components/action-creator"

export default function ActionsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Actions</h1>
      <ActionCreator />
    </div>
  )
}

