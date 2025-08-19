import { getContext, Provider as TanStackQueryProvider } from "@/integrations/tanstack-query/root-provider.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./router";

const TanStackQueryProviderContext = getContext();

createRoot(document.getElementById("root")!).render(
  <TanStackQueryProvider {...TanStackQueryProviderContext}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
    <TanStackRouterDevtools router={router} />
  </TanStackQueryProvider>
);
