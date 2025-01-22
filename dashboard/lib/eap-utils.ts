import axios from "axios"

interface CheckEAPTransactionParams {
  txHash: string
}

interface CheckEAPTransactionResponse {
  data: {
    success: boolean
    // Add any other fields that might be in the response
  }
}

export async function checkEAPTransaction({ txHash }: CheckEAPTransactionParams): Promise<CheckEAPTransactionResponse> {
  try {
    // Replace this URL with the actual API endpoint for checking EAP transactions
    const response = await axios.post("/api/check-eap-transaction", { txHash })
    return response.data
  } catch (error) {
    console.error("Error in checkEAPTransaction:", error)
    throw error
  }
}

