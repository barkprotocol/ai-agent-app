import { DashboardHeader } from "@/components/dashboard-header"
import { AccountSettings } from "@/components/account-settings"

export default function AccountPage() {
  return (
    <div className="p-6">
      <DashboardHeader title="Account Settings" />
      <AccountSettings />
    </div>
  )
}

