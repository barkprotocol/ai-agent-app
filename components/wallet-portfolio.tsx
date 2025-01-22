import { AvatarImage } from "@/components/AvatarImage"
import { ExternalLink } from "@/components/ExternalLink"
import { ScrollArea } from "@/components/ScrollArea"
import type { Token } from "@/types/token"

interface Props {
  tokens: Token[]
}

const TokenList = ({ tokens }: Props) => {
  return (
    <div className="relative">
      <ScrollArea className="h-[480px]" aria-label="Token list">
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token) => (
            <div
              key={token.address}
              className="flex items-center gap-4 rounded-lg bg-gray-100 p-4 transition-shadow hover:shadow-lg"
            >
              <AvatarImage
                src={token.imageUrl || "/placeholder.svg"}
                alt={`${token.name} token logo`}
                className="object-cover transition-transform duration-300 group-hover/row:scale-105"
              />
              <div>
                <div className="text-lg font-medium">{token.name}</div>
                <div className="text-sm text-gray-500">{token.symbol}</div>
              </div>
              <div className="ml-auto">
                <ExternalLink
                  href={`https://solscan.io/token/${token.address}`}
                  className="h-3.5 w-3.5 transition-colors group-hover/row:text-primary"
                  aria-label="View on Solscan"
                />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default TokenList

