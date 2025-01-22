"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Settings, MessageSquare, BarChart, Zap } from "lucide-react"
import { Logo } from "@/components/ui/layout/logo"

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: BarChart, label: "Analytics", href: "/analytics" },
  { icon: Zap, label: "AI Trading", href: "/trading" },
  { icon: MessageSquare, label: "AI Chat", href: "/chat" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white shadow-md h-full">
      <div className="p-4">
        <Logo />
      </div>
      <nav className="mt-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
              pathname === item.href ? "bg-gray-100" : ""
            }`}
          >
            <item.icon className="h-5 w-5 mr-2" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

