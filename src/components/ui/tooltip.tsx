import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type {
  TooltipContentProps as KobalteTooltipContentProps,
  TooltipRootProps as KobalteTooltipRootProps,
} from "@kobalte/core/tooltip";
import { Tooltip as TooltipPrimitive } from "@kobalte/core/tooltip";
import { type ValidComponent, mergeProps, splitProps } from "solid-js";

export const TooltipTrigger = TooltipPrimitive.Trigger;

export type TooltipProps = KobalteTooltipRootProps & {
  class?: string;
};

export const Tooltip = (props: TooltipProps) => {
  const merged = mergeProps<TooltipProps[]>({ gutter: 4 }, props);

  return <TooltipPrimitive {...merged} />;
};

type TooltipContentProps<T extends ValidComponent = "div"> =
  KobalteTooltipContentProps<T> & {
    class?: string;
  };

export const TooltipContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TooltipContentProps<T>>,
) => {
  const [local, rest] = splitProps(props as TooltipContentProps, ["class"]);

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        class={cn(
          "data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-xs data-[closed]:animate-out data-[expanded]:animate-in",
          local.class,
        )}
        {...rest}
      />
    </TooltipPrimitive.Portal>
  );
};
