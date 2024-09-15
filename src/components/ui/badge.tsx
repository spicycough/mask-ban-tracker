import { cn } from "@/lib/utils";
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { type ComponentProps, type ValidComponent, splitProps } from "solid-js";

export const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-shadow focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps<T extends ValidComponent = "div"> = ComponentProps<T> &
  VariantProps<typeof badgeVariants> & {
    class?: string;
  };

export const Badge = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, BadgeProps<T>>,
) => {
  const [local, rest] = splitProps(props as BadgeProps, ["class", "variant"]);

  return (
    <Polymorphic
      as="div"
      class={cn(
        badgeVariants({
          variant: local.variant,
        }),
        local.class,
      )}
      {...rest}
    />
  );
};
