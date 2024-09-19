import { createHonoClientSSR } from "@/lib/hono";
import { createDehydratedState } from "@/lib/ssr";

import type { PageContext } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContext) {
  const hc = createHonoClientSSR(
    pageContext.request.header(),
    pageContext.response.headers,
  );

  const prefetchQueries: Parameters<typeof createDehydratedState>["0"] = [
    {
      queryKey: ["map", "tiles"],
      queryFn: async () => {
        const res = await hc.map.tiles.$get();
        return res.json();
      },
    },
  ];

  return {
    dehydratedState: await createDehydratedState(prefetchQueries),
  };
}
