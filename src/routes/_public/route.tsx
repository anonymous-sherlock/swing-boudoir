import { createFileRoute, Outlet } from "@tanstack/react-router";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const Route = createFileRoute("/_public")({
  component: HomeLayout,
});

function HomeLayout() {
  const pathname = location.pathname;
  const publicProfilePage = pathname.startsWith("/profile");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <Outlet />

      {!publicProfilePage && <Footer />}
    </div>
  );
}
