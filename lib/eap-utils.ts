interface CheckEAPTransactionParams {
  txHash: string
}

interface CheckEAPTransactionResult {
  [x: string]: any
  success: boolean
  message?: string
}

export async function checkEAPTransaction({ txHash }: CheckEAPTransactionParams): Promise<CheckEAPTransactionResult> {
  try {
    const response = await fetch("/api/check-eap-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txHash }),
    })

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error checking EAP transaction:", error)
    return { success: false, message: "An error occurred while checking the transaction" }
  }
}

