import { DashboardHeader } from "@/components/dashboard-header"
import { AnalyticsCharts } from "@/components/analytics-charts"

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <DashboardHeader title="Analytics" />
      <AnalyticsCharts />
    </div>
  )
}

