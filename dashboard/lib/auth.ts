import { PrivyClient } from "@privy-io/react-auth"
import { Connection, PublicKey } from "@solana/web3.js"

const privy = new PrivyClient({
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
})

export const loginWithPrivy = async () => {
  try {
    const user = await privy.login()
    return user
  } catch (error) {
    console.error("Error logging in with Privy:", error)
    throw error
  }
}

export const loginWithSolana = async () => {
  try {
    // @ts-ignore
    const provider = window.solana
    if (!provider) {
      throw new Error("Solana wallet not found")
    }

    await provider.connect()
    const publicKey = provider.publicKey
    if (!publicKey) {
      throw new Error("Failed to connect to Solana wallet")
    }

    // You can perform additional actions here, such as verifying the wallet on your backend
    return publicKey.toString()
  } catch (error) {
    console.error("Error logging in with Solana:", error)
    throw error
  }
}

