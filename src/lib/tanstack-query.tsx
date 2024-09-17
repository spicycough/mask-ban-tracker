import {
  type DehydratedState,
  type HydrateOptions,
  type QueryClient,
  hydrate,
  useQueryClient,
} from "@tanstack/solid-query";
import { type FlowProps, onMount } from "solid-js";

type HydrationBoundaryProps = {
  state: DehydratedState;
  options?: HydrateOptions & {
    queryClient?: QueryClient;
  };
};

export const HydrationBoundary = (props: FlowProps<HydrationBoundaryProps>) => {
  onMount(() => {
    const queryClient = props.options?.queryClient ?? useQueryClient();
    hydrate(queryClient, props.state, props.options);
  });

  return <>{props.children}</>;
};
