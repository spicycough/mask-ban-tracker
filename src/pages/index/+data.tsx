import tiles from "@/assets/geo/style-positron.json";
import counties from "@/assets/geo/us-counties.json";
// import { hc } from "@/lib/hono";
// import { createDehydratedState } from "@/lib/ssr";

import type { PageContext } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContext) {
  return { tiles, counties };
}

// const prefetchQueries: Parameters<typeof createDehydratedState>["0"] = [
//   {
//     queryKey: ["tiles"],
//     queryFn: async () => hc.map.tiles.$get(),
//   },
//   {
//     queryKey: ["counties"],
//     queryFn: async () => hc.map.counties.$get(),
//   },
// ];
//
// return {
//   dehydratedState: await createDehydratedState(prefetchQueries),
// };
