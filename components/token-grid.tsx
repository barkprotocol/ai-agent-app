import type React from "react"
import cn from "classnames"

interface Token {
  name: string
  symbol: string
  price: number
  change: number
  transactions24h: number
  // ... other properties
}

const TokenCard: React.FC<{ token: Token }> = ({ token }): JSX.Element => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">
            {token.name} ({token.symbol})
          </h2>
          <div className="text-sm text-gray-600">Price: ${token.price.toFixed(2)}</div>
        </div>
        <div className="flex items-center">
          <div
            className={cn("mt-1 text-xs font-medium", token.change >= 0 ? "text-green-500" : "text-red-500")}
            aria-label={`Price change: ${token.change >= 0 ? "up" : "down"} ${Math.abs(token.change).toFixed(2)}%`}
          >
            {token.change >= 0 ? "+" : ""}
            {token.change.toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="mt-2">
        <span
          className="rounded bg-muted/50 px-1.5 py-0.5"
          aria-label={`${token.transactions24h.toLocaleString()} transactions in the last 24 hours`}
        >
          {token.transactions24h.toLocaleString()} txns
        </span>
      </div>
    </div>
  )
}

export default TokenCard

