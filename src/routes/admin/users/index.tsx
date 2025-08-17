import { createFileRoute } from '@tanstack/react-router';
import UserTable from './-data-table';
import { Suspense } from 'react';

export const Route = createFileRoute('/admin/users/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">All Users</h1>
        <p className="text-muted-foreground text-sm">
          Manage user accounts, permissions, and system access
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <UserTable />
      </Suspense>
    </div>
  );
}
