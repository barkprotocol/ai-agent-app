import type React from "react"
import { useState } from "react"
import { publicKeySchema } from "@/types/tool-types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SolanaAddressInput: React.FC = () => {
  const [address, setAddress] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      publicKeySchema.parse(address)
      setError(null)
      // Proceed with the valid address
      console.log("Valid Solana address:", address)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Solana address"
        aria-label="Solana address input"
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit">Submit</Button>
    </form>
  )
}

export default SolanaAddressInput

