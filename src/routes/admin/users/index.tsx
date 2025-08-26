import { createFileRoute } from "@tanstack/react-router";
import UserTable from "./-data-table";
import { Suspense } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQueryState } from "nuqs";

export const Route = createFileRoute("/admin/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="my-6">
        <h1 className="text-2xl font-bold tracking-tight">All Users</h1>
        <p className="text-muted-foreground text-sm">Manage user accounts, permissions, and system access</p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <UserTable />
      </Suspense>
    </>
  );
}
