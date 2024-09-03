import type { ApiRouter } from "@/server/api";
import { hc as honoClient } from "hono/client";

export const hc = honoClient<ApiRouter>("http://localhost:3000/api"); // TODO: parameterize this
