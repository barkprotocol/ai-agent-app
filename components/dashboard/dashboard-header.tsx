import { Menu } from "lucide-react"
import { UserNav } from "@/components/dashboard/user-nav"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { AppSidebarConversations } from "@/components/dashboard/app-sidebar-conversations"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center md:hidden">
          <MobileNav />
        </div>
        <div className="hidden md:flex md:items-center md:space-x-4">
          <AppSidebar />
          <AppSidebarConversations />
        </div>
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  )
}

