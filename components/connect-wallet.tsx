import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

const ConnectWallet: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const connectWallet = async () => {
    try {
      const { solana } = window

      if (solana?.isPhantom) {
        const response = await solana.connect()
        setWalletAddress(response.publicKey.toString())
      } else {
        alert("Phantom wallet not found! Please install it.")
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error)
    }
  }

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.solana?.isPhantom) {
        const response = await window.solana.connect({ onlyIfTrusted: true })
        setWalletAddress(response.publicKey.toString())
      }
    }

    checkWalletConnection()
  }, [])

  return (
    <div>
      {walletAddress ? (
        <p>Connected: {walletAddress}</p>
      ) : (
        <Button onClick={connectWallet}>Connect Phantom Wallet</Button>
      )}
    </div>
  )
}

export default ConnectWallet

