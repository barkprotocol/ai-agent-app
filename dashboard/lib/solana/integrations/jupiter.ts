import { type Connection, PublicKey } from "@solana/web3.js"
import { Jupiter } from "@jup-ag/core"

let jupiter: Jupiter | null = null

export async function initializeJupiter(connection: Connection, cluster: "mainnet-beta" | "devnet") {
  jupiter = await Jupiter.load({
    connection,
    cluster,
    userPublicKey: PublicKey.default, // This will be replaced with the actual user's public key when executing swaps
  })
}

export async function getTokenList() {
  if (!jupiter) throw new Error("Jupiter not initialized")
  return jupiter.getTokenList()
}

export async function getRoutes(inputMint: string, outputMint: string, amount: number, slippage: number) {
  if (!jupiter) throw new Error("Jupiter not initialized")
  return jupiter.computeRoutes({
    inputMint: new PublicKey(inputMint),
    outputMint: new PublicKey(outputMint),
    amount,
    slippageBps: slippage * 100,
  })
}

export async function executeSwap(route: any, userPublicKey: PublicKey) {
  if (!jupiter) throw new Error("Jupiter not initialized")
  const { transactions } = await jupiter.exchange({
    routeInfo: route,
    userPublicKey,
  })
  // Here you would typically sign and send the transaction
  // For this example, we'll just return the transaction
  return transactions
}

