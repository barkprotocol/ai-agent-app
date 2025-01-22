import { cookies } from "next/headers"
import { Card } from "@/components/ui/card"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { Banner } from "@/components/ui/banner"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { WalletContextProvider } from "@/components/ui/wallet-context-provider"

interface UserLayoutProps {
  children: React.ReactNode
}

export default async function UserLayout({ children }: UserLayoutProps) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "false"

  return (
    <WalletContextProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex min-h-screen flex-col md:flex-row">
          <AppSidebar />
          <SidebarInset className="flex w-full flex-col overflow-hidden">
            <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <SidebarTrigger className="mr-2 md:hidden" />
                <Banner>$BARK is now live on Raydium 🎉</Banner>
              </div>
            </header>
            <main className="flex-1 p-4 md:p-6">
              <Card className="mx-auto max-w-4xl p-6 shadow-lg">
                {children}
              </Card>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </WalletContextProvider>
  )
}