import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BARK AI Dashboard",
  description: "AI-powered trading and portfolio management on Solana",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto bg-gray-100 p-8">{children}</main>
        </div>
      </body>
    </html>
  )
}

