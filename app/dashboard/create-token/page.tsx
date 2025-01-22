import { CreateTokenForm } from "@/components/dashboard/create-token-form"

export default function CreateTokenPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Token</h1>
      <CreateTokenForm />
    </div>
  )
}

