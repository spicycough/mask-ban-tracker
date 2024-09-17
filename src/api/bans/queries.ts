import { hc } from "@/lib/hono";
import {
  createQueryKeys,
  type inferQueryKeys,
} from "@lukemorales/query-key-factory";
import { createQuery } from "@tanstack/solid-query";

export const bans = createQueryKeys("bans", {
  all: {
    queryKey: null,
    queryFn: () => hc.bans.$get(),
  },
  details: (id: string) => ({
    queryKey: [id],
    queryFn: async () => {
      const res = await hc.bans[":id"].$get({ param: { id } });
      return await res.json();
    },
  }),
});

export type BanQueryKeys = inferQueryKeys<typeof bans>;

export function useBans() {
  return createQuery(() => bans.all);
}

export function useBanDetails(id: string) {
  return createQuery(() => bans.details(id));
}
