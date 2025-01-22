import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/ui/layout/logo"
import { WalletButton } from "@/components/wallet-button"

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Logo className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-semibold text-gray-900">BARK AI Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <WalletButton />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

