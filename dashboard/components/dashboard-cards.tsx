import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import AnimatedNumber from "@/components/animated-number"
import { formatShortNumber, formatPercentage, formatCurrency, formatLargeNumber } from "@/lib/format-utils"

const monthlyData = [
  { name: "Jan", total: Math.floor(Math.random() * 5000) },
  { name: "Feb", total: Math.floor(Math.random() * 5000) },
  { name: "Mar", total: Math.floor(Math.random() * 5000) },
  { name: "Apr", total: Math.floor(Math.random() * 5000) },
  { name: "May", total: Math.floor(Math.random() * 5000) },
  { name: "Jun", total: Math.floor(Math.random() * 5000) },
]

const dailyData = [
  { name: "Mon", value: Math.floor(Math.random() * 100) },
  { name: "Tue", value: Math.floor(Math.random() * 100) },
  { name: "Wed", value: Math.floor(Math.random() * 100) },
  { name: "Thu", value: Math.floor(Math.random() * 100) },
  { name: "Fri", value: Math.floor(Math.random() * 100) },
  { name: "Sat", value: Math.floor(Math.random() * 100) },
  { name: "Sun", value: Math.floor(Math.random() * 100) },
]

export function DashboardCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={1234} direction="up" formatter={formatLargeNumber} />
          </div>
          <p className="text-xs text-muted-foreground">{formatPercentage(0.201, 1)} from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={567} direction="up" formatter={formatShortNumber} />
          </div>
          <p className="text-xs text-muted-foreground">{formatPercentage(0.105, 1)} from last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={98765} direction="up" formatter={formatLargeNumber} />
          </div>
          <p className="text-xs text-muted-foreground">{formatPercentage(0.352, 1)} from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <AnimatedNumber value={4.9} direction="up" decimalPlaces={1} />
            <span className="text-xl">/5</span>
          </div>
          <p className="text-xs text-muted-foreground">{formatPercentage(0.2, 1)} from last quarter</p>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Monthly Chat Activity</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Daily Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>AI Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

