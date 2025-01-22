import { DashboardHeader } from "@/components/dashboard-header"
import { UserProfile } from "@/components/user-profile"

export default function UserPage() {
  return (
    <div className="p-6">
      <DashboardHeader title="User Profile" />
      <UserProfile />
    </div>
  )
}

