import React, { useCallback, useMemo } from "react"
import { INTEGRATIONS } from "../data/integrations"
import { IntegrationCard } from "./integration-card"
import { useRouter } from "next/navigation"

const MemoizedIntegrationCard = React.memo(IntegrationCard)

export function IntegrationsGrid() {
  const router = useRouter()

  const handleIntegrationClick = useCallback(
    (label: string) => {
      router.push(`/integrations/${label.toLowerCase().replace(/\s+/g, "-")}`)
    },
    [router],
  )

  const memoizedIntegrations = useMemo(
    () =>
      INTEGRATIONS.map((item) => (
        <MemoizedIntegrationCard key={item.name} item={item} onClick={() => handleIntegrationClick(item.name)} />
      )),
    [handleIntegrationClick],
  )

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="grid"
      aria-label="Available integrations"
    >
      {memoizedIntegrations}
    </div>
  )
}

