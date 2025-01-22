import { PublicKey, VersionedTransaction } from "@solana/web3.js"
import type { SolanaAgentKit } from "./index"

interface TradeParams {
  inputMint: string
  outputMint: string
  amount: number
  slippage: number
}

/**
 * Execute a trade using Jupiter API
 * @param agent SolanaAgentKit instance
 * @param params Trade parameters
 * @returns Transaction signature
 */
export async function trade(agent: SolanaAgentKit, params: TradeParams): Promise<string> {
  try {
    const { inputMint, outputMint, amount, slippage } = params

    // Step 1: Get the route
    const routeUrl = `https://quote-api.jup.ag/v4/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippage * 100}`
    const routeResponse = await fetch(routeUrl)
    const routeData = await routeResponse.json()

    if (!routeData.data || routeData.data.length === 0) {
      throw new Error("No route found for the trade")
    }

    const bestRoute = routeData.data[0]

    // Step 2: Get the transaction
    const transactionUrl = "https://quote-api.jup.ag/v4/swap"
    const transactionResponse = await fetch(transactionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: bestRoute,
        userPublicKey: agent.wallet.publicKey.toBase58(),
        wrapUnwrapSOL: true,
      }),
    })

    const transactionData = await transactionResponse.json()

    // Step 3: Deserialize and sign the transaction
    const txn = VersionedTransaction.deserialize(Buffer.from(transactionData.swapTransaction, "base64"))

    const { blockhash } = await agent.connection.getLatestBlockhash()
    txn.message.recentBlockhash = blockhash

    txn.sign([agent.wallet])

    // Step 4: Execute the transaction
    const signature = await agent.connection.sendTransaction(txn, {
      preflightCommitment: "confirmed",
      maxRetries: 3,
    })

    // Step 5: Confirm the transaction
    const latestBlockhash = await agent.connection.getLatestBlockhash()
    await agent.connection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    })

    return signature
  } catch (error: any) {
    console.error(error)
    throw new Error(`Jupiter trade failed: ${error.message}`)
  }
}

