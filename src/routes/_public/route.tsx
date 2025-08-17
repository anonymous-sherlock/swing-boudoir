import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/_public")({
  component: HomeLayout,
});

function HomeLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <Outlet />

      <Footer />
    </div>
  );
}
