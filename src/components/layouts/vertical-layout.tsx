import { cn } from "@/lib/utils";
import {
  type ComponentProps,
  type FlowProps,
  type ValidComponent,
  splitProps,
} from "solid-js";
import { FloatingNavbar } from "../floating-navbar";

export type VerticalLayoutProps<T extends ValidComponent = "div"> = FlowProps<
  ComponentProps<T> & {
    class?: string;
  }
>;

export const Root = <T extends ValidComponent = "div">(
  props: VerticalLayoutProps<T>,
) => {
  const [local, rest] = splitProps(props as VerticalLayoutProps<T>, [
    "class",
    "children",
  ]);

  return (
    <div
      id="app"
      class={cn("flex min-h-dvh flex-col bg-neutral-200", local.class)}
      {...rest}
    >
      <FloatingNavbar />
      <main class="relative flex-1">{props.children}</main>
      <footer>Mask Ban Tracker</footer>
    </div>
  );
};

export const FullWidth = <T extends ValidComponent = "div">(
  props: VerticalLayoutProps<T>,
) => {
  return <>{props.children}</>;
};

export const NarrowWidth = <T extends ValidComponent = "div">(
  props: VerticalLayoutProps<T>,
) => {
  const [local, rest] = splitProps(props as VerticalLayoutProps<T>, [
    "class",
    "children",
  ]);

  return (
    <div class={cn("mx-auto max-w-5xl px-12", local.class)} {...rest}>
      <div class="h-screen bg-neutral-100 dark:bg-gray-800">
        {props.children}
      </div>
    </div>
  );
};
