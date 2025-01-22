import React, { useCallback, useState } from "react"
import { Button } from "@material-tailwind/react"
//import { useForm } from "react-hook-form";
//import { QuoteRequest } from "./types";
//import { JupiterAPI } from "./api";

// Dummy data and types - replace with your actual data and types
type QuoteResponse = {
  outAmount: number
  priceImpactPct: number
}

const USDC_MINT = "USDC_MINT_ADDRESS"
const SOL_MINT = "SOL_MINT_ADDRESS"

type QuoteRequest = {
  inputMint: string
  outputMint: string
  amount: number
}

const JupiterAPI = {
  getQuote: async (request: QuoteRequest): Promise<QuoteResponse> => {
    // Replace with your actual API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      outAmount: request.amount * 0.99, // Simulate a small price impact
      priceImpactPct: 0.01,
    }
  },
}

const formatNumber = (value: number, decimals: number): string => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

const App = () => {
  const [amount, setAmount] = useState<string>("")
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetQuote = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const parsedAmount = Number.parseFloat(amount)
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid amount")
      }
      const quoteRequest: QuoteRequest = {
        inputMint: USDC_MINT,
        outputMint: SOL_MINT,
        amount: Math.floor(parsedAmount * 1e6), // Convert to USDC decimals and ensure integer
      }
      const quoteResponse = await JupiterAPI.getQuote(quoteRequest)
      setQuote(quoteResponse)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [amount])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Get SOL Quote</h1>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">
          Amount (USDC):
        </label>
        <input
          type="text"
          id="amount"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={amount}
          onChange={(e) => {
            const value = e.target.value
            if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
              setAmount(value)
            }
          }}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button onClick={handleGetQuote} disabled={loading || !amount || Number(amount) <= 0}>
        {loading ? (
          <>
            <span className="mr-2">Loading...</span>
            <span className="animate-spin">⟳</span>
          </>
        ) : (
          "Get Quote"
        )}
      </Button>
      {quote && (
        <div className="mt-4 space-y-2">
          <p>You will receive approximately:</p>
          <p className="text-2xl font-bold">{formatNumber(quote.outAmount / 1e9, 4)} SOL</p>
          <p>Price Impact: {formatNumber(quote.priceImpactPct * 100, 2)}%</p>
        </div>
      )}
    </div>
  )
}

export default App

