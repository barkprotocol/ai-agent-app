import { PublicKey } from "@solana/web3.js"
import {
  getSolanaTools,
  getTokenBalance,
  getTokenMetadata,
  getNFTsForWallet,
  getRecentTransactions,
  getSOLUSDPrice,
  createCollectionAndMintCompressedNFTs,
  mintAdditionalCompressedNFTs,
  deployGamingToken,
  deployCustomToken,
  deployNFTCollection,
  type TokenMetadata,
  type DeployCollectionOptions,
} from "./solana-agent"
import type { CollectionConfig, NFTMetadata } from "./compressed-nft"

export async function demonstrateSolanaTools() {
  console.log("Demonstrating Solana Tools Usage:")

  const walletAddress = "YourWalletAddressHere"
  const tokenMintAddress = "TokenMintAddressHere"

  // Get token balance
  const balance = await getTokenBalance(walletAddress, tokenMintAddress)
  console.log(`Token Balance: ${balance}`)

  // Get token metadata
  const metadata = await getTokenMetadata(tokenMintAddress)
  console.log("Token Metadata:", metadata)

  // Get NFTs for wallet
  const nfts = await getNFTsForWallet(walletAddress)
  console.log("NFTs for Wallet:", nfts)

  // Get recent transactions
  const recentTransactions = await getRecentTransactions(walletAddress, 5)
  console.log("Recent Transactions:", recentTransactions)

  // Using Solana tools directly
  const tools = await getSolanaTools()

  // Example: Get SOL balance
  const solBalance = await tools.getBalance(new PublicKey(walletAddress))
  console.log(`SOL Balance: ${solBalance / 1e9} SOL`)

  // Example: Get token accounts
  const tokenAccounts = await tools.getTokenAccounts(new PublicKey(walletAddress))
  console.log("Token Accounts:", tokenAccounts)

  // Get SOL/USD price from Pyth
  const solUsdPrice = await getSOLUSDPrice()
  console.log(`Current SOL/USD price: $${solUsdPrice}`)

  // Demonstrate compressed NFT creation and minting
  const collectionConfig: CollectionConfig = {
    name: "My Compressed Collection",
    symbol: "MCC",
    uri: "https://example.com/collection-metadata.json",
    sellerFeeBasisPoints: 500, // 5%
  }

  const nftsToMint: NFTMetadata[] = [
    { name: "NFT 1", uri: "https://example.com/nft1-metadata.json" },
    { name: "NFT 2", uri: "https://example.com/nft2-metadata.json" },
  ]

  console.log("Creating compressed NFT collection and minting initial NFTs...")
  const { treeAddress, collectionAddress } = await createCollectionAndMintCompressedNFTs(collectionConfig, nftsToMint)
  console.log("Tree address:", treeAddress.toString())
  console.log("Collection address:", collectionAddress.toString())

  // Demonstrate minting additional compressed NFTs
  const additionalNFTs: NFTMetadata[] = [
    { name: "NFT 3", uri: "https://example.com/nft3-metadata.json" },
    { name: "NFT 4", uri: "https://example.com/nft4-metadata.json" },
  ]

  console.log("Minting additional compressed NFTs...")
  await mintAdditionalCompressedNFTs(treeAddress, collectionAddress, additionalNFTs, 500)

  // Demonstrate deploying a gaming token
  console.log("Deploying gaming token...")
  const gamingTokenMint = await deployGamingToken()
  console.log("Gaming token deployed with mint address:", gamingTokenMint)

  // Demonstrate deploying a custom token
  const customTokenMetadata: TokenMetadata = {
    name: "Custom Token",
    symbol: "CTKN",
    uri: "https://example.com/custom-token-metadata.json",
    decimals: 9,
    initialSupply: 10_000_000,
  }
  console.log("Deploying custom token...")
  const customTokenMint = await deployCustomToken(customTokenMetadata)
  console.log("Custom token deployed with mint address:", customTokenMint)

  // Demonstrate deploying an NFT collection
  const nftCollectionOptions: DeployCollectionOptions = {
    name: "Awesome Art",
    uri: "https://arweave.net/collection.json",
    royaltyBasisPoints: 500, // 5% royalty
  }
  console.log("Deploying NFT collection...")
  const nftCollectionResult = await deployNFTCollection(nftCollectionOptions)

  if (nftCollectionResult.status === "success") {
    console.log(
      `Collection "${nftCollectionResult.name}" deployed at address: ${nftCollectionResult.collectionAddress}`,
    )
  } else {
    console.error(`Deployment failed: ${nftCollectionResult.message} (Code: ${nftCollectionResult.code})`)
  }
}

// Uncomment the following line to run the demonstration
// demonstrateSolanaTools().catch(console.error)

