import type { Context } from "hono";

type User = {
  id: string;
  name: string;
};

type Session = {
  id: string;
  userId: string;
};

export const createContext = async (c: Context) => {
  return {
    honoContext: c,
    user: null as User | null,
    session: null as Session | null,
  };
};
