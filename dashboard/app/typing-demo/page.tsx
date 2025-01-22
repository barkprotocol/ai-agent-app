"use client"

import React, { useState } from "react"
import TypingAnimation from "@/components/ui/typing-animation"
import { Button } from "@/components/ui/button"

export default function TypingDemoPage() {
  const [text, setText] = useState("Welcome to BARK AI Dashboard")
  const [key, setKey] = useState(0)

  const handleRestart = () => {
    setText("BARK AI: Revolutionizing DeFi on Solana")
    setKey((prevKey) => prevKey + 1)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Typing Animation Demo</h1>
      <div className="space-y-6">
        <TypingAnimation
          key={key}
          text={text}
          duration={100}
          className="text-2xl"
          onComplete={() => console.log("Animation completed!")}
        />
        <Button onClick={handleRestart}>Restart Animation</Button>
      </div>
    </div>
  )
}

