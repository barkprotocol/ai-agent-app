"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { checkEAPTransaction } from "@/lib/eap-utils"

export function EAPTransactionChecker() {
  const [txHash, setTxHash] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleCheck = async () => {
    if (!txHash) {
      toast.error("Please enter a transaction hash")
      return
    }

    setIsChecking(true)
    try {
      const response = await checkEAPTransaction({ txHash })
      if (response?.data?.success) {
        setResult({
          success: true,
          message: `Transaction verified successfully. EAP should be granted to your account.`,
        })
      } else if (!response || !response.data) {
        throw new Error("Empty response received")
      } else {
        console.error("EAP verification failed:", response)
        setResult({
          success: false,
          message: "Failed to verify transaction. Please try again or contact support if the issue persists.",
        })
      }
    } catch (error) {
      console.error("Error checking EAP transaction:", error)
      toast.error("An error occurred while checking the transaction")
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <Input
        placeholder="Paste transaction hash"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        aria-label="Transaction hash input"
        aria-invalid={result?.success === false}
        disabled={isChecking}
      />
      <Button onClick={handleCheck} disabled={isChecking}>
        {isChecking ? "Verifying..." : "Verify Transaction"}
      </Button>
      {result && (
        <div
          className={`mt-4 p-4 rounded-md ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {result.message}
        </div>
      )}
    </div>
  )
}

