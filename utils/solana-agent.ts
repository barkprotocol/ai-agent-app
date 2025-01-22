import { Connection, Keypair, PublicKey, Transaction, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js"
import { SolanaAgentKit, createSolanaTools, type SolanaTools } from "solana-agent-kit"
import * as crypto from "crypto"
import {
  createCollectionAndMintNFTs,
  mintAdditionalNFTs,
  type CollectionConfig,
  type NFTMetadata,
} from "./compressed-nft"
import type { PublicKey as UmiPublicKey } from "@metaplex-foundation/umi"
import * as dotenv from "dotenv"
import type {
  CollectionOptions,
  CollectionDeployment,
  PumpFunTokenOptions,
  PumpfunLaunchResponse,
} from "@/types/solana-agent-kit"

dotenv.config()

// Function to securely decrypt private key using AES-GCM with Web Crypto API
async function decryptPrivateKey(encryptedPrivateKey: string): Promise<Uint8Array> {
  const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY
  const iv = process.env.NEXT_PUBLIC_ENCRYPTION_IV

  if (!secretKey || !iv) {
    throw new Error("Encryption key or IV is not set in environment variables")
  }

  try {
    const key = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secretKey),
      { name: "AES-GCM" },
      false,
      ["decrypt"],
    )

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new TextEncoder().encode(iv),
      },
      key,
      new Uint8Array(encryptedPrivateKey.match(/[\da-f]{2}/gi)!.map((h) => Number.parseInt(h, 16))),
    )

    return new Uint8Array(decrypted)
  } catch (error) {
    console.error("Decryption failed:", error)
    throw new Error("Failed to decrypt private key")
  }
}

interface SolanaAgentKitConfig {
  connection: Connection
  wallet: Keypair
  openAiApiKey: string
  coinGeckoApiKey?: string
  coinMarketCapApiKey?: string
}

export interface TokenMetadata {
  name: string
  symbol: string
  uri: string
  decimals: number
  initialSupply: number
}

export interface DeployCollectionOptions {
  name: string
  uri: string
  royaltyBasisPoints?: number
}

export interface DeployCollectionResponse {
  status: "success" | "error"
  message: string
  collectionAddress?: string
  name?: string
  code?: string
}

// Initialize the Solana Agent Kit
export async function initializeSolanaAgentKit(): Promise<SolanaAgentKit> {
  const encryptedPrivateKey = process.env.NEXT_PUBLIC_ENCRYPTED_PRIVATE_KEY
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"
  const openAiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  const coinGeckoApiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
  const coinMarketCapApiKey = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY

  if (!encryptedPrivateKey) {
    throw new Error("Encrypted private key is not set in environment variables")
  }

  if (!openAiApiKey) {
    throw new Error("OpenAI API key is not set in environment variables")
  }

  try {
    const privateKey = await decryptPrivateKey(encryptedPrivateKey)
    const keypair = Keypair.fromSecretKey(privateKey)
    const connection = new Connection(rpcUrl, "confirmed")

    return new SolanaAgentKit({
      connection,
      wallet: keypair,
      openAiApiKey,
      coinGeckoApiKey,
      coinMarketCapApiKey,
    })
  } catch (error) {
    console.error("Failed to initialize SolanaAgentKit:", error)
    throw new Error("Failed to initialize SolanaAgentKit")
  }
}

export async function createSolanaTools(): Promise<SolanaTools> {
  const agent = await initializeSolanaAgentKit()
  return createSolanaTools(agent)
}

// New function to get Solana tools
export async function getSolanaTools(): Promise<SolanaTools> {
  const tools = await createSolanaTools()
  return tools
}

export async function getWalletBalance(publicKey: string): Promise<number> {
  const agent = await initializeSolanaAgentKit()
  const balance = await agent.connection.getBalance(new PublicKey(publicKey))
  return balance / 1e9 // Convert lamports to SOL
}

// Send transaction with validation and monitoring
export async function sendTransaction(toPublicKey: string, amount: number): Promise<string> {
  // Validate the amount
  if (amount <= 0) {
    throw new Error("Amount must be greater than 0.")
  }

  const agent = await initializeSolanaAgentKit()
  const pubKey = new PublicKey(toPublicKey)
  const lamports = amount * 1e9 // Convert SOL to lamports

  // Check wallet balance
  const walletBalance = await agent.connection.getBalance(agent.wallet.publicKey)
  if (walletBalance < lamports) {
    throw new Error("Insufficient balance.")
  }

  // Send transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: agent.wallet.publicKey,
      toPubkey: pubKey,
      lamports,
    }),
  )

  const signature = await sendAndConfirmTransaction(agent.connection, transaction, [agent.wallet])

  console.log("Transaction confirmed:", signature)
  return signature
}

// New function to get SOL/USD price from Pyth
export async function getSOLUSDPrice(): Promise<number | null> {
  const agent = await initializeSolanaAgentKit()
  try {
    const priceFeedID = await agent.getPythPriceFeedID("SOL")
    const price = await agent.getPythPrice(priceFeedID)
    console.log("Price of SOL/USD:", price)
    return price
  } catch (error) {
    console.error("Error fetching SOL/USD price from Pyth:", error)
    return null
  }
}

export async function getPythPrice(priceFeedId: string): Promise<number | null> {
  const agent = await initializeSolanaAgentKit()
  try {
    const price = await agent.getPythPrice(priceFeedId)
    return price
  } catch (error) {
    console.error("Error fetching Pyth price:", error)
    return null
  }
}

export async function getCoinGeckoPrice(coinId: string): Promise<number | null> {
  const agent = await initializeSolanaAgentKit()
  try {
    const priceData = await agent.getCoinGeckoPrice(coinId)
    return priceData?.price ?? null
  } catch (error) {
    console.error("Error fetching CoinGecko price:", error)
    return null
  }
}

export async function getCoinMarketCapPrice(symbol: string): Promise<number | null> {
  const agent = await initializeSolanaAgentKit()
  try {
    const priceData = await agent.getCoinMarketCapPrice(symbol)
    return priceData?.price ?? null
  } catch (error) {
    console.error("Error fetching CoinMarketCap price:", error)
    return null
  }
}

// New utility functions using Solana tools

export async function getTokenBalance(walletAddress: string, tokenMintAddress: string): Promise<number> {
  const tools = await getSolanaTools()
  const balance = await tools.getTokenBalance(new PublicKey(walletAddress), new PublicKey(tokenMintAddress))
  return balance
}

export async function getTokenMetadata(tokenMintAddress: string): Promise<any> {
  const tools = await getSolanaTools()
  const metadata = await tools.getTokenMetadata(new PublicKey(tokenMintAddress))
  return metadata
}

export async function getNFTsForWallet(walletAddress: string): Promise<any[]> {
  const tools = await getSolanaTools()
  const nfts = await tools.getNFTsForWallet(new PublicKey(walletAddress))
  return nfts
}

export async function getRecentTransactions(walletAddress: string, limit = 10): Promise<any[]> {
  const tools = await getSolanaTools()
  const transactions = await tools.getRecentTransactions(new PublicKey(walletAddress), limit)
  return transactions
}

// New function to create a collection and mint compressed NFTs
export async function createCollectionAndMintCompressedNFTs(
  collectionConfig: CollectionConfig,
  nfts: NFTMetadata[],
): Promise<{ treeAddress: UmiPublicKey; collectionAddress: UmiPublicKey }> {
  try {
    const result = await createCollectionAndMintNFTs(collectionConfig, nfts)
    console.log("Collection created and NFTs minted successfully")
    return result
  } catch (error) {
    console.error("Error in createCollectionAndMintCompressedNFTs:", error)
    throw error
  }
}

// New function to mint additional compressed NFTs to an existing collection
export async function mintAdditionalCompressedNFTs(
  treeAddress: UmiPublicKey,
  collectionAddress: UmiPublicKey,
  nfts: NFTMetadata[],
  sellerFeeBasisPoints: number,
): Promise<void> {
  try {
    await mintAdditionalNFTs(treeAddress, collectionAddress, nfts, sellerFeeBasisPoints)
    console.log("Additional NFTs minted successfully")
  } catch (error) {
    console.error("Error in mintAdditionalCompressedNFTs:", error)
    throw error
  }
}

// New function to deploy a gaming token
export async function deployGamingToken(): Promise<string> {
  const agent = await initializeSolanaAgentKit()
  const tokenMetadata: TokenMetadata = {
    name: "Gaming Credits",
    symbol: "GCRED",
    uri: "https://example.com/token-metadata.json",
    decimals: 6,
    initialSupply: 1_000_000,
  }

  try {
    console.log(`Deploying token: ${tokenMetadata.name} (${tokenMetadata.symbol})`)

    const result = await agent.deployToken(
      tokenMetadata.name,
      tokenMetadata.uri,
      tokenMetadata.symbol,
      tokenMetadata.decimals,
      tokenMetadata.initialSupply,
    )

    console.log(`Token deployed successfully. Mint address: ${result.mint.toString()}`)
    return result.mint.toString()
  } catch (error) {
    console.error("Error deploying token:", error)
    throw error
  }
}

// New function to deploy a custom token
export async function deployCustomToken(tokenMetadata: TokenMetadata): Promise<string> {
  const agent = await initializeSolanaAgentKit()
  try {
    console.log(`Deploying custom token: ${tokenMetadata.name} (${tokenMetadata.symbol})`)

    const result = await agent.deployToken(
      tokenMetadata.name,
      tokenMetadata.uri,
      tokenMetadata.symbol,
      tokenMetadata.decimals,
      tokenMetadata.initialSupply,
    )

    console.log(`Custom token deployed successfully. Mint address: ${result.mint.toString()}`)
    return result.mint.toString()
  } catch (error) {
    console.error("Error deploying custom token:", error)
    throw error
  }
}

// New function to deploy an NFT collection
export async function deployNFTCollection(options: DeployCollectionOptions): Promise<DeployCollectionResponse> {
  const agent = await initializeSolanaAgentKit()
  try {
    const collection = await agent.deployCollection({
      name: options.name,
      uri: options.uri,
      royaltyBasisPoints: options.royaltyBasisPoints || 0,
    })

    console.log("Collection deployed:", {
      address: collection.collectionAddress.toString(),
      name: options.name,
    })

    return {
      status: "success",
      message: "Collection deployed successfully",
      collectionAddress: collection.collectionAddress.toString(),
      name: options.name,
    }
  } catch (error) {
    console.error("Collection deployment failed:", error)

    let errorMessage = "An unknown error occurred"
    let errorCode = "UNKNOWN_ERROR"

    if (error instanceof Error) {
      errorMessage = error.message
      if (errorMessage.includes("invalid uri")) {
        errorCode = "INVALID_URI"
      } else if (errorMessage.includes("insufficient funds")) {
        errorCode = "INSUFFICIENT_FUNDS"
      }
    }

    return {
      status: "error",
      message: errorMessage,
      code: errorCode,
    }
  }
}

export async function deployCollection(options: CollectionOptions): Promise<CollectionDeployment> {
  // Implementation here
}

export async function launchPumpFunToken(options: PumpFunTokenOptions): Promise<PumpfunLaunchResponse> {
  // Implementation here
}

