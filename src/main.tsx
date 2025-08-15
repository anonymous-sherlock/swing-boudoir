import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {getContext, Provider as TanStackQueryProvider} from "@/integrations/tanstack-query/root-provider.tsx";

const TanStackQueryProviderContext = getContext();

createRoot(document.getElementById("root")!).render(
  <TanStackQueryProvider {...TanStackQueryProviderContext}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
    <TanStackRouterDevtools router={router} />
  </TanStackQueryProvider>
);
