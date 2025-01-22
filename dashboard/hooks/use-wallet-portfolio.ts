import useSWR from "swr"
import type { WalletPortfolio } from "@/app/types/helius/portfolio"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useWalletPortfolio(address: string) {
  const { data, error, isLoading, mutate } = useSWR<WalletPortfolio>(`/api/wallet/${address}`, fetcher)

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  }
}

