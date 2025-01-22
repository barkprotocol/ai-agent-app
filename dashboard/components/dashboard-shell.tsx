import type { FC, ReactNode } from "react"

interface DashboardShellProps {
  children: ReactNode
  className?: string
}

export const DashboardShell: FC<DashboardShellProps> = ({ children, className }) => {
  return (
    <div className={`flex-1 space-y-4 p-4 md:space-y-6 md:p-6 ${className ?? ""}`}>
      <div className="flex flex-col space-y-4 md:space-y-6">{children}</div>
    </div>
  )
}

