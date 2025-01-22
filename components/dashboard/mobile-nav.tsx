"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { AppSidebarConversations } from "@/components/dashboard/app-sidebar-conversations"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <Button variant="ghost" size="icon" className="absolute right-4 top-4 md:hidden" onClick={() => setOpen(false)}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close Menu</span>
        </Button>
        <div className="flex flex-col h-full overflow-y-auto">
          <AppSidebar />
          <AppSidebarConversations />
        </div>
      </SheetContent>
    </Sheet>
  )
}

