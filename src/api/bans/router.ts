import { db } from "@/db";
import { Hono } from "@/lib/hono";
import { vValidator } from "@hono/valibot-validator";
import { inArray } from "drizzle-orm";
import * as v from "valibot";
import { mutations, queries } from "./actions";
import {
  type BanId,
  type BanPenaltyId,
  type BanRegionId,
  type BanStatusId,
  NewBanPenaltySchema,
  NewBanRegionSchema,
  NewBanSchema,
  NewBanStatusSchema,
  banPenalties,
  banRegions,
  banStatuses,
} from "./schema";

export const banRouter = new Hono()
  .get("/", async (c) => {
    const result = await queries.all();
    return c.json(result, 200);
  })
  .get(
    "/:id",
    vValidator(
      "param",
      v.object({
        id: v.pipe(
          v.string(),
          v.transform((value) => Number.parseInt(value)),
          v.number(),
        ),
      }),
      async (res, c) => {
        if (res.success) {
          const result = await queries.findById(res.output.id);
          return c.json(result);
        }

        return c.json(res.issues, 400);
      },
    ),
  )
  .delete(
    "/:id",
    vValidator(
      "param",
      v.object({
        id: v.pipe(
          v.string(),
          v.transform((value) => Number.parseInt(value)),
          v.number(),
        ),
      }),
      async (res, c) => {
        if (!res.success) {
          return c.json(res.issues, 400);
        }
        await mutations.delete(res.output.id);
        return c.json(null, 204);
      },
    ),
  )
  .post(
    "/",
    vValidator("json", NewBanSchema, async (res, c) => {
      if (!res.success) {
        return c.json(res.issues, 400);
      }
      const result: BanId = await mutations.create(res.output);
      return c.json({ id: result }, 201);
    }),
  )
  .get("/regions", async (c) => {
    const result = await db.select().from(banRegions);
    return c.json(result, 200);
  })
  .get("/regions/:id", async (c) => {
    const ids: BanRegionId[] = c.req
      .param("id")
      ?.split(",")
      .map(Number.parseInt);
    if (!ids) {
      return c.json({ error: "No IDs found" }, 400);
    }
    const result = await db
      .select()
      .from(banRegions)
      .where(({ id }) => inArray(id, ids));
    return c.json(result, 200);
  })
  .post(
    "/regions",
    vValidator("json", NewBanRegionSchema, async (res, c) => {
      if (!res.success) {
        return c.json(res.issues, 400);
      }
      const [{ banRegionId }]: { banRegionId: BanRegionId }[] = await db
        .insert(banRegions)
        .values(res.output)
        .returning({ banRegionId: banRegions.id });
      return c.json({ id: banRegionId }, 201);
    }),
  )
  .post(
    "/penalties",
    vValidator("json", NewBanPenaltySchema, async (res, c) => {
      if (!res.success) {
        return c.json(res.issues, 400);
      }
      const [{ banPenaltyId }]: { banPenaltyId: BanPenaltyId }[] = await db
        .insert(banPenalties)
        .values(res.output)
        .returning({ banPenaltyId: banPenalties.id });
      return c.json({ id: banPenaltyId }, 201);
    }),
  )
  .post(
    "/status",
    vValidator("json", NewBanStatusSchema, async (res, c) => {
      if (!res.success) {
        return c.json(res.issues, 400);
      }
      const [{ banStatusId }]: { banStatusId: BanStatusId }[] = await db
        .insert(banStatuses)
        .values(res.output)
        .returning({ banStatusId: banStatuses.id });
      return c.json({ id: banStatusId }, 201);
    }),
  );
