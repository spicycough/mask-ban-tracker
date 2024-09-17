import { db } from "@/db";
import { and, eq, inArray, isNotNull } from "drizzle-orm";
import {
  type BanId,
  type NewBan,
  banPenalties,
  banRegions,
  banStatuses,
  bans,
} from "./schema";

export const queries = {
  all: async () => {
    const res = await db
      .selectDistinct({
        id: bans.id,
        regionName: banRegions.name,
        regionType: banRegions.type,
        status: banStatuses.status,
        condition: bans.condition,
        proposedDate: banStatuses.proposedDate,
        effectiveDate: banStatuses.effectiveDate,
        enactedDate: banStatuses.enactedDate,
        repealedDate: banStatuses.repealedDate,
        fineMin: banPenalties.fineMin,
        fineMax: banPenalties.fineMax,
        jailMin: banPenalties.jailMin,
        jailMax: banPenalties.jailMax,
        penaltyLink: banPenalties.link,
        createdAt: bans.createdAt,
        updatedAt: bans.updatedAt,
      })
      .from(bans)
      .leftJoin(banRegions, eq(bans.regionId, banRegions.id))
      .leftJoin(banStatuses, eq(bans.statusId, banStatuses.id))
      .fullJoin(banPenalties, eq(bans.id, banPenalties.banId))
      .where(isNotNull(bans.id));
    return res;
  },
  findById: async (id: BanId) => {
    const [res] = await db
      .selectDistinct({
        id: bans.id,
        regionName: banRegions.name,
        regionType: banRegions.type,
        status: banStatuses.status,
        condition: bans.condition,
        proposedDate: banStatuses.proposedDate,
        effectiveDate: banStatuses.effectiveDate,
        enactedDate: banStatuses.enactedDate,
        repealedDate: banStatuses.repealedDate,
        fineMin: banPenalties.fineMin,
        fineMax: banPenalties.fineMax,
        jailMin: banPenalties.jailMin,
        jailMax: banPenalties.jailMax,
        penaltyLink: banPenalties.link,
        createdAt: bans.createdAt,
        updatedAt: bans.updatedAt,
      })
      .from(bans)
      .leftJoin(banRegions, eq(bans.regionId, banRegions.id))
      .leftJoin(banStatuses, eq(bans.statusId, banStatuses.id))
      .fullJoin(banPenalties, eq(bans.id, banPenalties.banId))
      .where(and(isNotNull(bans.id), eq(bans.id, id)));
    return res;
  },
  findByIds: async (ids: BanId[]) => {
    const res = await db
      .selectDistinct({
        id: bans.id,
        regionName: banRegions.name,
        regionType: banRegions.type,
        status: banStatuses.status,
        condition: bans.condition,
        proposedDate: banStatuses.proposedDate,
        effectiveDate: banStatuses.effectiveDate,
        enactedDate: banStatuses.enactedDate,
        repealedDate: banStatuses.repealedDate,
        fineMin: banPenalties.fineMin,
        fineMax: banPenalties.fineMax,
        jailMin: banPenalties.jailMin,
        jailMax: banPenalties.jailMax,
        penaltyLink: banPenalties.link,
        createdAt: bans.createdAt,
        updatedAt: bans.updatedAt,
      })
      .from(bans)
      .leftJoin(banRegions, eq(bans.regionId, banRegions.id))
      .leftJoin(banStatuses, eq(bans.statusId, banStatuses.id))
      .fullJoin(banPenalties, eq(bans.id, banPenalties.banId))
      .where(and(isNotNull(bans.id), inArray(bans.id, ids)));
    return res;
  },
};

export const mutations = {
  create: async (newBan: NewBan) => {
    const [{ id }] = await db
      .insert(bans)
      .values(newBan)
      .returning({ id: bans.id });
    return id;
  },
  delete: async (id: BanId | undefined) => {
    if (id) {
      db.delete(bans).where(eq(bans.id, id));
    }
  },
};
