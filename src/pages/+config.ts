import Head from "@/components/head";
import vikeSolidQuery from "vike-solid-query/config";
import vikeSolid from "vike-solid/config";

import type { Config } from "vike/types";

// Default config (can be overridden by pages)
export default {
  Head,
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  },
  title: "Track Mask Bans",
  passToClient: ["routeParams"],
  // stream: true,
  // injectScriptsAt: "STREAM",
  extends: [vikeSolid, vikeSolidQuery],
} satisfies Config;
