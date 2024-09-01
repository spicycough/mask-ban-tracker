/** Only place private configurations here. */
export const privateConfig = {
  /** Port of the app (in dev). */
  PORT: (process.env.PORT || 3000) as number,
  /** Development or Production. */
  NODE_ENV: (process.env.NODE_ENV ?? "development") as
    | "development"
    | "production",
  /** MapTiler API Key. */
  MAPTILER_API_KEY: process.env.MAPTILER_API_KEY as string,
};
