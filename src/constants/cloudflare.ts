export const CF_BUCKET = {
  COUNTIES_DATA: "counties-data",
  STATES_DATA: "states-data",
} as const;

export type CF_BUCKET_KEY = keyof typeof CF_BUCKET;
export type CF_BUCKET = (typeof CF_BUCKET)[CF_BUCKET_KEY];
