import { PublicKey } from "@solana/web3.js"

export type TokenSymbol = "USDC" | "USDT" | "ETH" | "BTC"

/** Meteora dynamic AMM program ID */
export const METEORA_DYNAMIC_AMM_PROGRAM_ID = new PublicKey("Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB")

/** Meteora DLMM (Decentralized Liquidity Market Maker) program ID */
export const METEORA_DLMM_PROGRAM_ID = new PublicKey("LbVRzDTvBDEcrthxfZ4RL6yiq3uZw8bS6MwtdY6UhFQ")

export const TOKENS: Record<TokenSymbol, PublicKey> = {
  USDC: new PublicKey("EPjFWdd5AufqSSqeM2qGfKe2hhVpYEcJoJ796hWqL92"),
  USDT: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
  ETH: new PublicKey("7vfCXTUXrp5aHeY98v2tY1c7X1j1Z77kR1pu4i9kP7"),
  BTC: new PublicKey("9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtR7wMj7HEmJa"),
} as const

/**
 * Get the PublicKey for a given token symbol
 * @param {TokenSymbol} symbol - The token symbol to look up
 * @returns {PublicKey} The PublicKey associated with the token symbol
 * @throws {Error} If the token symbol is not found in the TOKENS object
 */
export function getTokenPublicKey(symbol: TokenSymbol): PublicKey {
  const publicKey = TOKENS[symbol]
  if (!publicKey) {
    throw new Error(`Token symbol "${symbol}" not found`)
  }
  return publicKey
}

