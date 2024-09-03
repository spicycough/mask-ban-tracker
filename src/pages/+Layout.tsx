import type { FlowProps } from "solid-js";

// CSS
import "@/styles/globals.css";

import { Toaster } from "solid-sonner";

import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";

export default function RootLayout(props: FlowProps) {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SolidQueryDevtools initialIsOpen={false} />
        {props.children}
      </QueryClientProvider>
      <Toaster />
    </>
  );
}
