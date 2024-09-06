import { db } from "@/db";
import { type Location, type NewLocation, locations } from "@/db/schema";

// const locations = [
//   {
//     id: "county-nassau",
//     name: "Nassau County",
//     layer: {
//       sourceId: "counties",
//       filter: ["==", "NAME", "Nassau"],
//     },
//     viewport: {
//       center: { lat: 40.73, lon: -73.59 },
//       zoom: 11,
//     },
//   },
//   {
//     id: "county-losangeles",
//     name: "Los Angeles County",
//     layer: {
//       sourceId: "counties",
//       filter: ["==", "NAME", "Nassau"],
//     },
//     viewport: {
//       center: { lat: 40.73, lon: -73.59 },
//       zoom: 11,
//     },
//   },
//   {
//     name: "North Carolina",
//     id: "state-nc",
//     layer: {
//       sourceId: undefined,
//       filter: ["==", "NAME", "Nassau"],
//     },
//     viewport: {
//       center: { lat: 40.73, lon: -73.59 },
//       zoom: 7,
//     },
//   },
//   {
//     name: "Ohio",
//     id: "state-oh",
//     viewport: {
//       center: { lat: 40.73, lon: -73.59 },
//       zoom: 7,
//     },
//     layer: {
//       sourceId: undefined,
//       filter: ["==", "NAME", "Nassau"],
//     },
//   },
// ] as const;

const DAO = {
  location: {
    all: async (): Promise<Location[]> => {
      return db.select().from(locations).all();
    },
    findById: async (id: Location["id"]): Promise<Location | undefined> => {
      return db.query.locations.findFirst({
        where: ({ id: locationId }, { eq }) => eq(locationId, id),
      });
    },
    create: async (newLocation: NewLocation): Promise<Location["id"]> => {
      const [{ id }] = await db
        .insert(locations)
        .values(newLocation)
        .returning({ id: locations.id });
      return id;
    },
  },
};
