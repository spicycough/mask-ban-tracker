import { createHonoClientSSR } from "@/lib/hono";
import { createDehydratedState } from "@/lib/ssr";

import type { PageContext } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContext) {
  const hc = createHonoClientSSR(
    pageContext.request.header(),
    pageContext.response.headers,
  );

  const banId = pageContext.routeParams.id;

  const prefetchQueries: Parameters<typeof createDehydratedState>["0"] = [
    {
      queryKey: ["bans", banId],
      queryFn: async () => {
        const res = await hc.bans[":id"].$get({
          param: { id: banId },
        });
        return res.json();
      },
    },
  ];

  const dehydratedState = await createDehydratedState(prefetchQueries);

  return { dehydratedState };
}
