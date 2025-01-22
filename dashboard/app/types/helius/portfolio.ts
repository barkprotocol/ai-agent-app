export interface WalletPortfolio {
  address: string
  totalBalance: number
  tokens: {
    name: string
    symbol: string
    balance: number
    pricePerToken: number
    imageUrl: string
    mint: string
  }[]
}

interface FungibleToken {
  mint: string
  amount: number
  decimals: number
  tokenAccount: string
  tokenName: string
  tokenSymbol: string
  price: number
  logoURI?: string
}

interface NonFungibleToken {
  mint: string
  name: string
  symbol: string
  imageUrl?: string
}

export function transformToPortfolio(
  address: string,
  fungibleTokens: FungibleToken[],
  nonFungibleTokens: NonFungibleToken[],
): WalletPortfolio {
  const tokens = fungibleTokens.map((token) => ({
    name: token.tokenName,
    symbol: token.tokenSymbol,
    balance: token.amount / Math.pow(10, token.decimals),
    pricePerToken: token.price,
    imageUrl: token.logoURI || "",
    mint: token.mint,
  }))

  const totalBalance = tokens.reduce((sum, token) => sum + token.balance * token.pricePerToken, 0)

  return {
    address,
    totalBalance,
    tokens,
  }
}

