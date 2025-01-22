import { Suspense } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar className="hidden md:block" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </main>
      </div>
      <Toaster />
    </div>
  )
}


