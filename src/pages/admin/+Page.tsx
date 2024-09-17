import { hc } from "@/lib/hono";
import { QueryBoundary } from "@/lib/vike-solid-query";
import { createQuery } from "@tanstack/solid-query";
import { BansDataTable } from "./components/bans-table";

export default function Page() {
  const query = createQuery(() => ({
    queryKey: ["bans"],
    queryFn: async () => {
      const res = await hc.bans.$get();
      return res.json();
    },
  }));

  return (
    <QueryBoundary query={query}>
      {(data) => (
        <div class="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div class="flex items-center justify-between space-y-2">
            <div>
              <h2 class="font-bold text-2xl tracking-tight">Mask Bans</h2>
              <p class="text-muted-foreground">
                View, create, edit, and delete bans.
              </p>
            </div>
          </div>
          <BansDataTable data={data} />
        </div>
      )}
    </QueryBoundary>
  );
}
