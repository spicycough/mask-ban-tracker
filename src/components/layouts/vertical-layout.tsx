import { cn } from "@/lib/utils";
import {
  type ComponentProps,
  type FlowProps,
  type ValidComponent,
  splitProps,
} from "solid-js";
import VerticalFooter from "./vertical-footer";
import VerticalNav from "./vertical-nav";

export type VerticalLayoutProps<T extends ValidComponent = "div"> =
  ComponentProps<T>;

export default function VerticalLayout(props: FlowProps<VerticalLayoutProps>) {
  const [local, rest] = splitProps(props as VerticalLayoutProps, ["class"]);

  return (
    <div class={cn("flex min-h-screen flex-col", local.class)} {...rest}>
      <VerticalNav />
      <main class="relative flex-1">{props.children}</main>
      <VerticalFooter />
    </div>
  );
}
