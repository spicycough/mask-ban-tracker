import { cn } from "@/lib/utils";
import {
  type ComponentProps,
  type ValidComponent,
  type VoidProps,
  splitProps,
} from "solid-js";

type VerticalFooterProps<T extends ValidComponent = "footer"> =
  ComponentProps<T>;

export default function VerticalFooter(props: VoidProps<VerticalFooterProps>) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <footer
      class={cn("flex h-32 items-center justify-center", local.class)}
      {...rest}
    >
      Mask Ban Tracker
    </footer>
  );
}
