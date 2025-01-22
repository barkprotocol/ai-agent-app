import { NextResponse } from "next/server"

export async function GET() {
  const data = {
    message: `Hello from the server! The time is ${new Date().toLocaleTimeString()}`,
    timestamp: Date.now(),
  }

  return NextResponse.json(data)
}

