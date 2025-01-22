import { useMemo } from "react"
import { SolanaAgentKit } from "@/lib/solana-agent-kit"
import { Connection } from "@solana/web3.js"

export function useSolanaAgentKit() {
  const agent = useMemo(() => {
    const privateKey = process.env.NEXT_PUBLIC_SOLANA_PRIVATE_KEY
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"

    let connection: Connection | null = null
    try {
      connection = new Connection(rpcUrl)
    } catch (error) {
      console.warn("Failed to create Solana connection:", error)
      return null
    }

    if (!privateKey) {
      console.warn("Solana private key not set. Some features may be limited.")
      return new SolanaAgentKit(null, connection, {
        OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
      })
    }

    return new SolanaAgentKit(privateKey, connection, {
      OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    })
  }, [])

  return agent
}


