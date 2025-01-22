"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AITradingAgent } from "@/components/ai-trading-agent"
import { WalletInfo } from "@/components/wallet-info"
import { useWalletPortfolio } from "@/hooks/use-wallet-portfolio"

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null)
  const [activeProjects, setActiveProjects] = useState<number | null>(null)
  const { data: portfolio, isLoading: isPortfolioLoading, refresh } = useWalletPortfolio()

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      // Replace with actual API calls
      setTotalUsers(1234)
      setTotalRevenue(12345)
      setActiveProjects(42)
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalUsers ?? "Loading..."}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${totalRevenue ?? "Loading..."}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{activeProjects ?? "Loading..."}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {isPortfolioLoading ? "Loading..." : `$${portfolio?.totalBalance.toFixed(2)}`}
            </p>
            <Button onClick={refresh} className="mt-2" size="sm">
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <AITradingAgent />
        <WalletInfo />
      </div>
    </div>
  )
}

