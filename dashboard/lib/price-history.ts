import { z } from "zod"

import { TIMEFRAME } from "@/app/types/chart"

const API_KEY = process.env.CG_API_KEY
const BASE_URL = process.env.CG_BASE_URL || "https://pro-api.coingecko.com/api/v3"

const tokenSchema = z.object({ id: z.string() })

const priceHistorySchema = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])),
})

const dexOhlcvApiResponseSchema = z.object({
  data: z.object({
    attributes: z.object({
      ohlcv_list: z.array(z.array(z.number()).length(6)),
    }),
  }),
})

function mapTimeframeToCgInterval(timeFrame: TIMEFRAME): string {
  switch (timeFrame) {
    case TIMEFRAME.DAYS:
      return "daily"
    case TIMEFRAME.HOURS:
      return "hourly"
    default:
      return "hourly"
  }
}

function mapTimeframeToDexPath(timeFrame: TIMEFRAME): string {
  switch (timeFrame) {
    case TIMEFRAME.DAYS:
      return "day"
    case TIMEFRAME.HOURS:
      return "hour"
    case TIMEFRAME.MINUTES:
      return "minute"
    default:
      return "minute"
  }
}

function validateAggregator(timeFrame: TIMEFRAME, aggregator?: string): string {
  const agg = aggregator ?? "1"

  if (timeFrame === TIMEFRAME.DAYS && agg !== "1") {
    console.warn(`Invalid aggregator '${agg}' for DAYS. Defaulting to '1'.`)
    return "1"
  }
  if (timeFrame === TIMEFRAME.HOURS && !["1", "4", "12"].includes(agg)) {
    console.warn(`Invalid aggregator '${agg}' for HOURS. Defaulting to '1'.`)
    return "1"
  }
  if (timeFrame === TIMEFRAME.MINUTES && !["1", "5", "15"].includes(agg)) {
    console.warn(`Invalid aggregator '${agg}' for MINUTES. Defaulting to '1'.`)
    return "1"
  }

  return agg
}

export async function getTokenId(contractAddress: string, network = "solana"): Promise<string> {
  if (!API_KEY) throw new Error("CoinGecko API key not found")
  const url = `${BASE_URL}/coins/${network}/contract/${contractAddress}`
  const response = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json", "x-cg-pro-api-key": API_KEY },
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch token ID for ${contractAddress}: ${errorText}`)
  }
  const data = await response.json()
  return tokenSchema.parse(data).id
}

export async function getPriceHistoryFromCG(
  tokenId: string,
  timeFrame: TIMEFRAME = TIMEFRAME.DAYS,
  timeDelta = 7,
): Promise<{ time: number; value: number }[]> {
  if (!API_KEY) throw new Error("CoinGecko API key not found")
  const interval = mapTimeframeToCgInterval(timeFrame)
  const url = `${BASE_URL}/coins/${tokenId}/market_chart?vs_currency=usd&days=${timeDelta}&interval=${interval}&precision=18`
  const response = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json", "x-cg-pro-api-key": API_KEY },
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch market_chart for ${tokenId}: ${errorText}`)
  }
  const data = await response.json()
  const parsed = priceHistorySchema.parse(data)
  return parsed.prices.map(([time, value]) => ({ time, value }))
}

async function getTokenPools(contractAddress: string, network = "solana"): Promise<string> {
  if (!API_KEY) throw new Error("CoinGecko API key not found")
  const url = `${BASE_URL}/onchain/networks/${network}/tokens/${contractAddress}/pools`
  const response = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json", "x-cg-pro-api-key": API_KEY },
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch token pools for ${contractAddress}: ${errorText}`)
  }
  const json = await response.json()
  const poolData = json.data
  if (!Array.isArray(poolData) || poolData.length === 0) {
    throw new Error(`No pools found for ${contractAddress}`)
  }
  const topPoolId = poolData[0]?.attributes?.address
  if (!topPoolId) throw new Error(`No valid pool ID in the response for ${contractAddress}`)
  return topPoolId
}

async function getDexOhlcv(
  poolId: string,
  network = "solana",
  timeFrame: TIMEFRAME = TIMEFRAME.MINUTES,
  aggregator?: string,
  beforeTimestamp?: number,
): Promise<{ time: number; value: number }[]> {
  if (!API_KEY) throw new Error("CoinGecko API key not found")
  const path = mapTimeframeToDexPath(timeFrame)
  const agg = validateAggregator(timeFrame, aggregator)
  let url = `${BASE_URL}/onchain/networks/${network}/pools/${poolId}/ohlcv/${path}?aggregate=${agg}&currency=usd`
  if (beforeTimestamp) url += `&before_timestamp=${beforeTimestamp}`
  const response = await fetch(url, {
    method: "GET",
    headers: { accept: "application/json", "x-cg-pro-api-key": API_KEY },
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch DEX OHLCV for pool ${poolId}: ${errorText}`)
  }
  const data = await response.json()
  const parsed = dexOhlcvApiResponseSchema.parse(data)
  const ohlcvList = parsed.data.attributes.ohlcv_list

  const reversedOhlcv = ohlcvList.map(([timestamp, open, high, low, close]) => {
    const price = close ?? open ?? 0
    return { time: timestamp * 1000, value: price }
  })
  reversedOhlcv.reverse()
  return reversedOhlcv
}

export async function getDexPriceHistory(
  contractAddress: string,
  network = "solana",
  timeFrame: TIMEFRAME = TIMEFRAME.MINUTES,
  aggregator?: string,
  beforeTimestamp?: number,
): Promise<{ time: number; value: number }[]> {
  const topPoolId = await getTokenPools(contractAddress, network)
  return getDexOhlcv(topPoolId, network, timeFrame, aggregator, beforeTimestamp)
}

export async function getPriceHistory(
  contractAddress: string,
  network = "solana",
  timeFrame: TIMEFRAME = TIMEFRAME.DAYS,
  timeDelta = 7,
  aggregator?: string,
  beforeTimestamp?: number,
): Promise<{ time: number; value: number }[]> {
  try {
    // First, try to get price history from CoinGecko
    const tokenId = await getTokenId(contractAddress, network)
    return await getPriceHistoryFromCG(tokenId, timeFrame, timeDelta)
  } catch (err) {
    console.warn("Failed to fetch from CoinGecko, falling back to DEX data:", err)
    // If CoinGecko fails, fall back to DEX price history
    return getDexPriceHistory(contractAddress, network, timeFrame, aggregator, beforeTimestamp)
  }
}

