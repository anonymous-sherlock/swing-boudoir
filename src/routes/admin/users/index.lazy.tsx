import { createLazyFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import UserTable from "./-data-table";
import { AddUserPopup } from "./-data-table/actions/add-user-popup";

export const Route = createLazyFileRoute("/admin/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All Users</h1>
            <p className="text-muted-foreground text-sm">Manage user accounts, permissions, and system access</p>
          </div>
          <AddUserPopup />
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <UserTable />
      </Suspense>
    </>
  );
}
