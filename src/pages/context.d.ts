import type { HonoRequest } from "hono";

// Extend the PageContext in Vike.
declare global {
  // For Vike types
  namespace Vike {
    interface PageContext {
      request: HonoRequest<"*", unknown>;
      response: Response;
    }
  }
}
