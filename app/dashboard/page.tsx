import { UserOverview } from "@/components/dashboard/user-overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <UserOverview />
      <RecentActivity />
    </div>
  )
}

