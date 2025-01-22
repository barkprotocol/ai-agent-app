"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { type Suggestion, getRandomSuggestions, SUGGESTIONS } from "@/lib/suggestions"

interface SuggestionGridProps {
  onSuggestionClick: (suggestion: Suggestion) => void
}

export function SuggestionGrid({ onSuggestionClick }: SuggestionGridProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    setSuggestions(getRandomSuggestions(6))
  }, [])

  const handleRefresh = () => {
    setSuggestions(getRandomSuggestions(6))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Suggestions</h2>
        <Button onClick={handleRefresh} variant="outline">
          Refresh
        </Button>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {suggestions.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{suggestion.title}</h3>
                <p className="text-sm text-muted-foreground">{suggestion.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

