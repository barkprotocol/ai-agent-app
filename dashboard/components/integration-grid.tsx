import React, { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { IntegrationCard } from "./integration-card"
import { INTEGRATIONS, type Integration } from "../data/integrations"

export function IntegrationGrid() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)

  const handleIntegrationClick = (integration: Integration) => {
    setSelectedIntegration(integration)
  }

  const handleCloseDialog = () => {
    setSelectedIntegration(null)
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {INTEGRATIONS.map((integration) => (
          <IntegrationCard
            key={integration.name}
            item={integration}
            onClick={() => handleIntegrationClick(integration)}
          />
        ))}
      </motion.div>

      <Dialog open={!!selectedIntegration} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedIntegration?.name}</DialogTitle>
            <DialogDescription>{selectedIntegration?.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p>Primary Color: {selectedIntegration?.theme.primary}</p>
            <p>Secondary Color: {selectedIntegration?.theme.secondary}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

