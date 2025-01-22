import Image from "next/image"

const Wallet = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div
        className="flex items-center gap-1.5"
        aria-label={`Wallet balance: ${data.totalBalance ? `$${data.totalBalance}` : "Not available"}`}
      >
        <span className="text-lg font-medium">{data.totalBalance ? `$${data.totalBalance}` : "N/A"}</span>
      </div>

      <ul className="space-y-2 mt-4" role="list">
        {data.tokens.map((token) => (
          <li key={token.name} className="flex items-center gap-2" role="listitem">
            <Image
              src={token.imageUrl || "/placeholder.svg"}
              alt={`${token.name} logo`}
              width={24}
              height={24}
              className="rounded-full"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
                console.error(`Failed to load image for token: ${token.name}`)
              }}
            />
            <div>
              <span className="font-medium">{token.name}</span>
              <span className="text-sm text-gray-500">({token.symbol})</span>
            </div>
            <span className="ml-auto text-sm text-gray-500">{token.balance}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Wallet

