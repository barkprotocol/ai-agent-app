"use client"

import React from "react"
import { ClientTweetCard } from "@/components/tweet-card"

export default function TweetDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tweet Demo</h1>
      <div className="space-y-6">
        <ClientTweetCard id="1" apiUrl="/api/tweet/1" className="max-w-lg" />
        <ClientTweetCard id="2" apiUrl="/api/tweet/2" className="max-w-lg" />
        <ClientTweetCard id="3" apiUrl="/api/tweet/not-found" className="max-w-lg" />
      </div>
    </div>
  )
}

