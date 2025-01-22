import { NextResponse } from "next/server"

const mockTweets = {
  "1": {
    id: "1",
    text: "Just launched our new AI-powered trading assistant! #BARK #Solana #DeFi",
    author: {
      name: "BARK AI",
      username: "barkprotocol",
      profile_image_url: "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp",
    },
    created_at: "2023-06-15T10:00:00Z",
  },
  "2": {
    id: "2",
    text: "Excited to announce our partnership with @solana! Together, we're bringing AI-powered DeFi to the masses. 🚀",
    author: {
      name: "BARK AI",
      username: "barkprotocol",
      profile_image_url: "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp",
    },
    created_at: "2023-06-16T14:30:00Z",
  },
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (id in mockTweets) {
    return NextResponse.json(mockTweets[id as keyof typeof mockTweets])
  } else {
    return new NextResponse("Tweet not found", { status: 404 })
  }
}

