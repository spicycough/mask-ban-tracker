import { cn } from "@/lib/utils";
import {
  type ComponentProps,
  type FlowProps,
  type ValidComponent,
  splitProps,
} from "solid-js";
import HorizontalSidebar from "./horizontal-sidebar";

type HorizontalLayoutProps<T extends ValidComponent = "div"> =
  ComponentProps<T>;

export default function HorizontalLayout(
  props: FlowProps<HorizontalLayoutProps>,
) {
  const [local, rest] = splitProps(props as HorizontalLayoutProps, ["class"]);

  return (
    <div class={cn("flex h-screen", local.class)} {...rest}>
      <HorizontalSidebar />
      <main class="flex-grow px-5">{props.children}</main>
    </div>
  );
}
