import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { Toaster } from "solid-sonner";

import type { FlowProps, ParentProps } from "solid-js";

import "@/styles/globals.css";

const queryClient = new QueryClient();

export default function RootLayout(props: FlowProps) {
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

function Content(props: ParentProps) {
  return (
    <div id="app">
      <div class="min-h-dvh p-5 pb-[50px]">{props.children}</div>
    </div>
  );
}
