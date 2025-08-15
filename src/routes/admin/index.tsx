import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: () => <Page />,
})

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Swing Boudior admin panel. Manage competitions, users, and settings.
        </p>
      </div>
      
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl p-6">
          <h3 className="font-semibold mb-2">Total Competitions</h3>
          <p className="text-2xl font-bold">24</p>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl p-6">
          <h3 className="font-semibold mb-2">Active Users</h3>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl p-6">
          <h3 className="font-semibold mb-2">Total Votes</h3>
          <p className="text-2xl font-bold">5,678</p>
        </div>
      </div>
      
      <div className="bg-muted/50 min-h-[400px] flex-1 rounded-xl p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <p className="text-muted-foreground">No recent activity to display.</p>
      </div>
    </div>
  )
}
