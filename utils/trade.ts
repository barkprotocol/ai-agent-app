import { PublicKey } from "@solana/web3.js"
import { SolanaAgentKit } from "solana-agent-kit"
import { initializeSolanaAgentKit, getSOLUSDPrice, getPythPrice } from "./solana-agent"

export interface TradeOptions {
  fromToken: string
  toToken: string
  amount: number
}

export interface TradeResult {
  status: "success" | "error"
  message: string
  transactionSignature?: string
  fromAmount?: number
  toAmount?: number
}

export async function executeTrade(options: TradeOptions): Promise<TradeResult> {
  const agent = await initializeSolanaAgentKit()

  try {
    console.log(`Executing trade: ${options.amount} ${options.fromToken} to ${options.toToken}`)

    const result = await agent.swap({
      fromToken: new PublicKey(options.fromToken),
      toToken: new PublicKey(options.toToken),
      amount: options.amount,
    })

    console.log("Trade executed successfully:", result)

    return {
      status: "success",
      message: "Trade executed successfully",
      transactionSignature: result.signature,
      fromAmount: options.amount,
      toAmount: result.outputAmount,
    }
  } catch (error) {
    console.error("Trade execution failed:", error)

    return {
      status: "error",
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function getTokenBalance(tokenAddress: string): Promise<number> {
  const agent = await initializeSolanaAgentKit()

  try {
    const balance = await agent.getTokenBalance(new PublicKey(tokenAddress))
    console.log(`Balance for token ${tokenAddress}: ${balance}`)
    return balance
  } catch (error) {
    console.error("Error fetching token balance:", error)
    throw error
  }
}

export async function getTokenPrice(tokenAddress: string): Promise<number | null> {
  try {
    // First, try to get the price from Pyth
    const pythPrice = await getPythPrice(tokenAddress)
    if (pythPrice !== null) {
      return pythPrice
    }

    // If Pyth price is not available, fallback to SOL/USD price
    if (tokenAddress.toLowerCase() === "sol") {
      return await getSOLUSDPrice()
    }

    // If it's neither SOL nor available on Pyth, return null
    console.warn(`Price not available for token: ${tokenAddress}`)
    return null
  } catch (error) {
    console.error("Error fetching token price:", error)
    return null
  }
}

export async function estimateTradeOutput(options: TradeOptions): Promise<number | null> {
  const agent = await initializeSolanaAgentKit()

  try {
    const estimate = await agent.getSwapQuote({
      fromToken: new PublicKey(options.fromToken),
      toToken: new PublicKey(options.toToken),
      amount: options.amount,
    })

    console.log(`Estimated output for trade: ${estimate.outputAmount} ${options.toToken}`)
    return estimate.outputAmount
  } catch (error) {
    console.error("Error estimating trade output:", error)
    return null
  }
}

export async function getTradeHistory(walletAddress: string, limit = 10): Promise<any[]> {
  const agent = await initializeSolanaAgentKit()

  try {
    const history = await agent.getSwapHistory(new PublicKey(walletAddress), limit)
    console.log(`Retrieved ${history.length} trade history items for wallet: ${walletAddress}`)
    return history
  } catch (error) {
    console.error("Error fetching trade history:", error)
    throw error
  }
}

