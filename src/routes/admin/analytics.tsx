import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/analytics')({
  component: () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View detailed analytics and insights about your platform.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Page Views</h3>
          <p className="text-2xl font-bold">12,345</p>
          <p className="text-sm text-muted-foreground">+12% from last month</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Unique Users</h3>
          <p className="text-2xl font-bold">8,901</p>
          <p className="text-sm text-muted-foreground">+8% from last month</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Engagement Rate</h3>
          <p className="text-2xl font-bold">67%</p>
          <p className="text-sm text-muted-foreground">+5% from last month</p>
          </div>
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Conversion Rate</h3>
          <p className="text-2xl font-bold">3.2%</p>
          <p className="text-sm text-muted-foreground">+0.5% from last month</p>
        </div>
      </div>
      
      <div className="bg-muted/50 min-h-[400px] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Traffic Overview</h3>
        <p className="text-muted-foreground">Chart will be displayed here.</p>
      </div>
    </div>
  ),
})
