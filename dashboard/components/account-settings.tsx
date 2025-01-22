"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function AccountSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleSave = () => {
    // Handle saving account settings
    console.log("Settings saved:", { emailNotifications, darkMode })
  }

  return (
    <div className="space-y-4 max-w-md">
      <div className="flex items-center justify-between">
        <Label htmlFor="email-notifications">Email Notifications</Label>
        <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode">Dark Mode</Label>
        <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
      </div>
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  )
}

