import { getContext, Provider as TanStackQueryProvider } from "@/integrations/tanstack-query/root-provider.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createRoot } from "react-dom/client";
import "./App.css";
import "./index.css";
import { router } from "./router";
import { Suspense } from "react";
import { PageLoader } from "./components/PageLoader";

const TanStackQueryProviderContext = getContext();

createRoot(document.getElementById("root")!).render(
  <TanStackQueryProvider {...TanStackQueryProviderContext}>
    <Suspense fallback={<></>}>
      <RouterProvider router={router} />
    </Suspense>
    <ReactQueryDevtools initialIsOpen={false} position="top" />
    <TanStackRouterDevtools router={router} position="bottom-left" />
  </TanStackQueryProvider>
);
