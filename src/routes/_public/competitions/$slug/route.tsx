import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/competitions/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
