import axios from "axios"

const HELIUS_API_KEY = process.env.HELIUS_API_KEY
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`

interface HeliusResponse {
  fungibleTokens: any[]
  nonFungibleTokens: any[]
}

export async function searchWalletAssets(address: string): Promise<HeliusResponse> {
  try {
    const response = await axios.post(HELIUS_RPC_URL, {
      jsonrpc: "2.0",
      id: "my-id",
      method: "searchAssets",
      params: {
        ownerAddress: address,
        tokenType: "all",
        displayOptions: {
          showNativeBalance: true,
        },
      },
    })

    return response.data.result
  } catch (error) {
    console.error("Error fetching wallet assets from Helius:", error)
    throw error
  }
}

