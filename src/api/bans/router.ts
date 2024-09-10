import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { mutations, queries } from "./actions";
import {
  type Location,
  type LocationId,
  LocationSchema,
  NewLocationSchema,
} from "./schema";

export const banRouter = new Hono()
  .get("/locations", async (c) => {
    const result: Location[] = await queries.all();
    return c.json(result, 200);
  })
  .get(
    "/locations/:id",
    vValidator("param", v.pick(LocationSchema, ["id"])),
    async (c) => {
      const ids: LocationId[] = c.req.param("id")?.split(",");
      if (!ids) {
        return c.json({ error: "No IDs found" }, 400);
      }

      const result: Location[] = await queries.findByIds(ids);
      return c.json(result, 200);
    },
  )
  .post(
    "/locations",
    vValidator("json", NewLocationSchema, async (res, c) => {
      if (!res.success) {
        return c.json(res.issues, 400);
      }
      const result: LocationId = await mutations.create(res.output);
      return c.json({ id: result }, 201);
    }),
  );
