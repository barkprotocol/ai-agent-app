import { NextResponse } from "next/server"
import { fetch } from "undici"
import type { NextRequest } from "next/server"

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || "https://ai.barkprotocol.net/api/submit"
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["*"]

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json()

    // Validate the input
    if (!body.query || typeof body.query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 })
    }

    const { query } = body

    console.log("Received query:", query)

    // Forward the query to the external API
    const response = await fetch(EXTERNAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })

    // Check if the external request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("External API error:", errorData)
      return NextResponse.json({ error: "Failed to process query", details: errorData }, { status: response.status })
    }

    const result = await response.json()

    // Return a success response with the result from the external API
    return NextResponse.json({ message: "Query submitted successfully!", result }, { status: 200 })
  } catch (error) {
    console.error("Error in submit-query API:", error)
    return NextResponse.json({ error: "An unexpected error occurred while processing the query" }, { status: 500 })
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin")
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin || "") ? origin : ALLOWED_ORIGINS[0]

  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  )
}

