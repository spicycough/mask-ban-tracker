import bansData from "@/constants/bans.json";
import { eq } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { P, match } from "ts-pattern";
import {
  PenaltyClassification,
  banPenalties,
  banRegions,
  banStatuses,
  bans,
  references,
} from "./schema";

export async function seedBansData(db: LibSQLDatabase) {
  if (!bansData) {
    throw new Error("Bans data not found.");
  }

  return await db.transaction(async (tx) => {
    const { rowsAffected: deleteCount } = await tx.delete(bans);
    console.log(`Deleted ${deleteCount} bans.`);

    let rowsAffected = 0;
    for (const [region, data] of Object.entries(bansData)) {
      for (const ban of data.laws) {
        // Check if region exists
        const query = await tx
          .select({ regionId: banRegions.id })
          .from(banRegions)
          .where(eq(banRegions.name, region));

        let regionId: number | undefined;
        if (query.length === 0) {
          // If not, add it
          [{ regionId }] = await tx
            .insert(banRegions)
            .values({
              name: ban.region.name,
              type: ban.region.type,
            })
            .returning({ regionId: banRegions.id });
        } else {
          regionId = query[0].regionId;
        }

        const toYYYYMM = (date: { month?: number; year: number }) => {
          if (date.month) {
            return `${date.year}-${date.month}`;
          }
          return `${date.year}`;
        };

        // Create status record
        const [{ statusId }] = await tx
          .insert(banStatuses)
          .values({
            status: ban.status,
            enactedDate:
              ban.status === "enacted" && ban.enactedDate
                ? toYYYYMM(ban.enactedDate)
                : undefined,
            proposedDate:
              ban.status === "proposed" && ban.proposedDate
                ? toYYYYMM(ban.proposedDate)
                : undefined,
            effectiveDate:
              ban.status === "enacted" && ban.effectiveDate
                ? toYYYYMM(ban.effectiveDate)
                : undefined,
            repealedDate:
              ban.status === "repealed" && ban.repealedDate
                ? toYYYYMM(ban.repealedDate)
                : undefined,
          })
          .returning({ statusId: banStatuses.id });

        // Create bans record
        const [{ banId }] = await tx
          .insert(bans)
          .values({
            /** Foreign keys */
            regionId,
            statusId,

            /** Properties */
            condition: ban.condition,
            isExisting: ban.status === "enacted",
            proposedBy: ban.description,
          })
          .returning({ banId: bans.id });
        if (banId) {
          rowsAffected++;
        }

        // Create notes records
        for (const note of ban.notes ?? []) {
          await tx.insert(references).values({
            text: note.text,
            link: note.link,
          });
        }

        // Create penalty record
        for (const penalty of ban.penalties ?? []) {
          const classification = match(penalty.classification)
            .returnType<PenaltyClassification | undefined>()
            .with(
              P.string.includes("misdemeanor"),
              () => PenaltyClassification.MISDEMEANOR,
            )
            .with(
              P.intersection(
                P.string.includes("felony"),
                P.string.includes(" a "),
              ),
              () => PenaltyClassification.FELONY_A,
            )
            .with(
              P.intersection(
                P.string.includes("felony"),
                P.string.includes(" b "),
              ),
              () => PenaltyClassification.FELONY_B,
            )
            .with(
              P.intersection(
                P.string.includes("felony"),
                P.string.includes(" c "),
              ),
              () => PenaltyClassification.FELONY_C,
            )
            .with(
              P.intersection(
                P.string.includes("felony"),
                P.string.includes(" d "),
              ),
              () => PenaltyClassification.FELONY_D,
            )
            .with(
              P.intersection(
                P.string.includes("felony"),
                P.string.includes(" e "),
              ),
              () => PenaltyClassification.FELONY_E,
            )
            .otherwise(() => undefined);

          await tx.insert(banPenalties).values({
            classification: classification,
            fineMin: penalty.fine?.min,
            fineMax: penalty.fine?.max,
            jailMin: penalty.jail?.min,
            jailMax: penalty.jail?.max,
            link: penalty.link,
          });
        }
      }
    }

    return rowsAffected;
  });
}
