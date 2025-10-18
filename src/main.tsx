import { getContext, Provider as TanStackQueryProvider } from "@/integrations/tanstack-query/root-provider.tsx";
import * as Sentry from "@sentry/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import "./index.css";
import { router } from "./router";

Sentry.init({
  dsn: "https://743bf0056f5046983e48af707f62ca11@o4510210415656960.ingest.us.sentry.io/4510210417688576",
  sendDefaultPii: true,
  environment: import.meta.env.MODE === "development" ? "development" : "production",
});

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
