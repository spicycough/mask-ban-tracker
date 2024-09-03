export const routes = {
  Home: "/",
  About: "/about",
  NotFound: "/404",
  SignUp: "/sign-up",
  SignIn: "/sign-in",
  Dashboard: "/dashboard",
  get Settings() {
    return `${this.Dashboard}/settings` as const;
  },
} as const;

export type RouteKey = keyof typeof routes;
export type Route = (typeof routes)[keyof typeof routes];
