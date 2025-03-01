"use client"

import { type FC, useState, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2, Copy, Check } from "lucide-react"
import type { PhantomProvider } from "@/types/phantom"

export const WalletButton: FC = () => {
  const { publicKey, wallet, disconnect, connecting, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [copying, setCopying] = useState(false)

  useEffect(() => {
    if (connected) {
      toast.success("Wallet connected successfully!")
    }
  }, [connected])

  const handleWalletClick = useCallback(async () => {
    if (!connected) {
      setVisible(true)
    } else {
      try {
        await disconnect()
      } catch (error) {
        console.error("Failed to disconnect:", error)
        toast.error("Failed to disconnect. Please try again.")
      }
    }
  }, [connected, disconnect, setVisible])

  const copyAddress = useCallback(async () => {
    if (publicKey) {
      try {
        await navigator.clipboard.writeText(publicKey.toBase58())
        setCopying(true)
        toast.success("Address copied to clipboard!")
        setTimeout(() => setCopying(false), 1500)
      } catch (error) {
        console.error("Failed to copy address:", error)
        toast.error("Failed to copy address. Please try again.")
      }
    }
  }, [publicKey])

  const connectPhantom = useCallback(async () => {
    const provider = window.phantom?.solana as PhantomProvider | undefined

    if (provider?.isPhantom) {
      try {
        const { publicKey } = await provider.connect()
        toast.success(`Connected to Phantom with public key: ${publicKey.toBase58()}`)
      } catch (error) {
        console.error("Failed to connect to Phantom:", error)
        toast.error("Failed to connect to Phantom. Please try again.")
      }
    } else {
      window.open("https://phantom.app/", "_blank")
    }
  }, [])

  const truncatedAddress = publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : ""

  return (
    <div className="flex justify-center items-center space-x-4 py-4">
      <Button
        onClick={handleWalletClick}
        variant="outline"
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={connecting}
        aria-label={connecting ? "Connecting wallet" : connected ? "Disconnect wallet" : "Connect wallet"}
      >
        {connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : connected ? (
          "Disconnect"
        ) : (
          "Connect Wallet"
        )}
      </Button>

      {connected && publicKey && (
        <Button
          onClick={copyAddress}
          variant="outline"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
          disabled={copying}
          aria-label={copying ? "Address copied" : `Copy wallet address: ${truncatedAddress}`}
        >
          {copying ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              {truncatedAddress}
            </>
          )}
        </Button>
      )}

      <Button
        onClick={connectPhantom}
        variant="outline"
        className="bg-purple-500 text-white hover:bg-purple-600"
        aria-label="Connect to Phantom"
      >
        Connect Phantom
      </Button>
    </div>
  )
}

