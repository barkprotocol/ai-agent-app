import type { FungibleToken } from "./fungible-token"
import type { NonFungibleToken } from "./non-fungible-token"

export const SOL_MINT = "So11111111111111111111111111111111111111112"

export interface Token {
  mint: string
  name: string
  symbol: string
  imageUrl: string
  balance: number
  pricePerToken: number
  decimals: number
}

export interface NFT {
  name: string
  symbol: string
  imageUrl: string
  collectionName: string
}

export interface WalletPortfolio {
  address: string
  totalBalance: number
  tokens: Token[]
  nfts: NFT[]
}

// Helper function to get the image URL with fallbacks
function getImageUrl(token: FungibleToken | NonFungibleToken): string {
  return token.content.files?.[0]?.uri || token.content.links?.image || ""
}

export function transformToPortfolio(
  address: string,
  fungibleTokens: FungibleToken[],
  nonFungibleTokens: NonFungibleToken[],
): WalletPortfolio {
  // Rename Wrapped SOL to Solana
  const sol = fungibleTokens.find((token) => token.id === SOL_MINT)
  if (sol) {
    sol.content.metadata.name = "Solana"
  }

  const tokens: Token[] = fungibleTokens
    .filter((token) => {
      // Keep SOL or tokens with value greater than $5
      const tokenValue = token.token_info.balance * (token.token_info.price_info?.price_per_token || 0)
      return token.id === SOL_MINT || tokenValue > 5
    })
    .map((token) => ({
      mint: token.id,
      name: token.content.metadata.name,
      symbol: token.content.metadata.symbol,
      imageUrl: getImageUrl(token),
      balance: token.token_info.balance / Math.pow(10, token.token_info.decimals),
      pricePerToken: token.token_info.price_info?.price_per_token || 0,
      decimals: token.token_info.decimals,
    }))
    // Ensure only one SOL token is included (in case of duplicate entries)
    .filter((token, index, self) => token.symbol !== "SOL" || index === self.findIndex((t) => t.symbol === "SOL"))

  const nfts: NFT[] = nonFungibleTokens.map((nft) => ({
    name: nft.content.metadata.name,
    symbol: nft.content.metadata.symbol,
    imageUrl: getImageUrl(nft),
    collectionName: nft.grouping?.[0]?.collection_metadata?.name || "",
  }))

  const totalBalance = tokens.reduce((acc, token) => acc + token.balance * token.pricePerToken, 0)

  // Always make sure SOL is the first token
  const solToken = tokens.find((token) => token.symbol === "SOL")
  const otherTokens = tokens.filter((token) => token.symbol !== "SOL")
  const sortedTokens = solToken ? [solToken, ...otherTokens] : otherTokens

  return {
    address,
    totalBalance,
    tokens: sortedTokens,
    nfts,
  }
}

