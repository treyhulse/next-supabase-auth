import { Card } from "@/components/ui/card"
import { Metadata } from "next"
import {
  CircleIcon,
  TrendingUpIcon,
  UsersIcon,
  ActivityIcon,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard with analytics and key metrics",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <CircleIcon className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <h2 className="text-2xl font-bold">$45,231</h2>
              <p className="text-xs text-green-500">+20.1% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <UsersIcon className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <h2 className="text-2xl font-bold">2,420</h2>
              <p className="text-xs text-green-500">+15% from last week</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <TrendingUpIcon className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <h2 className="text-2xl font-bold">3.2%</h2>
              <p className="text-xs text-red-500">-1% from last week</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <ActivityIcon className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <h2 className="text-2xl font-bold">1,429</h2>
              <p className="text-xs text-green-500">+5% from last hour</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-6">
          <h3 className="text-lg font-semibold">Revenue Over Time</h3>
          {/* Add your preferred chart component here */}
          <div className="h-[300px] w-full bg-slate-100 rounded-lg mt-4">
            {/* Placeholder for chart */}
          </div>
        </Card>

        <Card className="col-span-3 p-6">
          <h3 className="text-lg font-semibold">User Demographics</h3>
          {/* Add your preferred chart component here */}
          <div className="h-[300px] w-full bg-slate-100 rounded-lg mt-4">
            {/* Placeholder for chart */}
          </div>
        </Card>
      </div>
    </div>
  )
} 