import type { ReactNode } from "react"
import type { SolanaWalletConnectors } from "@privy-io/react-auth/solana"
import { useMemo, useEffect, useState } from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana"
import { useTheme } from "next-themes"
import { ErrorBoundary } from "@/components/ui/error-boundary"

interface AuthProvidersProps {
  children: ReactNode
}

const AuthProviders: React.FC<AuthProvidersProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div aria-live="polite" role="status">
        Loading authentication service...
      </div>
    )
  }

  if (!privyAppId) {
    console.error("NEXT_PUBLIC_PRIVY_APP_ID is not set in the environment variables")
    return (
      <div aria-live="assertive" role="alert" className="text-red-500 font-bold p-4">
        Authentication service is not configured properly. Please contact support.
      </div>
    )
  }

  const connectors = useMemo(() => {
    return toSolanaWalletConnectors({
      privyAppId,
    })
  }, [privyAppId])

  return (
    <ErrorBoundary
      fallback={
        <div aria-live="assertive" role="alert" className="text-red-500 font-bold p-4">
          An error occurred in the authentication service. Please refresh the page or try again later.
        </div>
      }
    >
      <PrivyProvider appId={privyAppId} theme={theme} solanaConnectors={connectors}>
        {children}
      </PrivyProvider>
    </ErrorBoundary>
  )
}

export default AuthProviders

