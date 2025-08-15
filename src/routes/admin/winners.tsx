import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/winners')({
  component: () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Winners</h1>
        <p className="text-muted-foreground">
          View and manage competition winners and prize distributions.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Total Winners</h3>
          <p className="text-2xl font-bold">156</p>
          <p className="text-sm text-muted-foreground">Across all competitions</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Pending Payouts</h3>
          <p className="text-2xl font-bold">23</p>
          <p className="text-sm text-muted-foreground">Awaiting processing</p>
        </div>
        <div className="bg-muted/50 rounded-xl p-6">
          <h3 className="font-semibold mb-2">Total Prizes</h3>
          <p className="text-2xl font-bold">$45,678</p>
          <p className="text-sm text-muted-foreground">Distributed this month</p>
        </div>
      </div>
      
      <div className="bg-muted/50 min-h-[400px] rounded-xl p-6">
        <h3 className="font-semibold mb-4">Recent Winners</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <p className="font-medium">Sarah Johnson</p>
              <p className="text-sm text-muted-foreground">Hot Girl Summer Competition</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">$1,500</p>
              <p className="text-sm text-muted-foreground">Paid</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <p className="font-medium">Mike Chen</p>
              <p className="text-sm text-muted-foreground">Workout Warrior Challenge</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">$2,000</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
})
