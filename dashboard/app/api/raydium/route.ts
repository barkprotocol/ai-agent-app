import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const inputMint = searchParams.get("inputMint")
  const outputMint = searchParams.get("outputMint")
  const amount = searchParams.get("amount")

  // Here you would typically call the Raydium API
  // For this example, we'll return a mock price
  const mockPrice = Math.random() * 100

  return NextResponse.json({ price: mockPrice })
}

