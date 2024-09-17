import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import { type ComponentProps, type ValidComponent, splitProps } from "solid-js";

export const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export type LabelProps<T extends ValidComponent = "label"> = ComponentProps<T> &
  VariantProps<typeof labelVariants>;

export const Label = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, LabelProps<T>>,
) => {
  const [local, rest] = splitProps(props as LabelProps, ["class"]);

  return (
    <Polymorphic
      as="label"
      class={cn(labelVariants(), local.class)}
      {...rest}
    />
  );
};
