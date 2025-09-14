import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, CheckCircle, AlertCircle, Clock } from "lucide-react";
import PaymentsTable from "./-data-table";
import { usePaymentsAnalytics } from "@/hooks/api/usePayments";

export const Route = createFileRoute("/admin/payments/")({
  component: () => <AdminPaymentsPage />,
});

function AdminPaymentsPage() {
  const { data: analytics, isLoading, error } = usePaymentsAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments Management</h1>
          <p className="text-muted-foreground text-sm">Monitor all payment transactions across the platform with advanced filtering and export capabilities</p>
        </div>
      </div>

      {/* Stats Cards - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Payments Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-700">Total Payments</p>
                <p className="text-2xl font-bold text-blue-900">{isLoading ? "..." : error ? "Error" : analytics?.totalPayments || 0}</p>
                <p className="text-xs text-blue-600">${analytics?.amounts?.total?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed Payments Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-700">Completed</p>
                <p className="text-2xl font-bold text-emerald-900">{isLoading ? "..." : error ? "Error" : analytics?.completedPayments || 0}</p>
                <p className="text-xs text-emerald-600">${analytics?.amounts?.completed?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-700">Pending</p>
                <p className="text-2xl font-bold text-amber-900">{isLoading ? "..." : error ? "Error" : analytics?.pendingPayments || 0}</p>
                <p className="text-xs text-amber-600">${analytics?.amounts?.pending?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Failed Payments Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-700">Failed</p>
                <p className="text-2xl font-bold text-red-900">{isLoading ? "..." : error ? "Error" : analytics?.failedPayments || 0}</p>
                <p className="text-xs text-red-600">${analytics?.amounts?.failed?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentsTable />
        </CardContent>
      </Card>
    </div>
  );
}