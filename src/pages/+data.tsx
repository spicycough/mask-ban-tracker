import { QueryClient } from "@tanstack/solid-query";

export type Data = Awaited<ReturnType<typeof data>>;

export async function data() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: typeof window !== "undefined",
        staleTime: Number.POSITIVE_INFINITY,
        retryDelay: 2000,
      },
    },
  });

  return {
    queryClient,
  };
}
