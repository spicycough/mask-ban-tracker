import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import type { FlowProps } from "solid-js";
import { Toaster } from "solid-sonner";

const queryClient = new QueryClient();

export default function Wrapper(props: FlowProps) {
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
