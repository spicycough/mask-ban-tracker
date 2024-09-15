import { cn } from "@/lib/utils";
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import {
  type ComponentProps,
  type ValidComponent,
  mergeProps,
  splitProps,
} from "solid-js";

type InputProps<T extends ValidComponent = "input"> = ComponentProps<T> & {
  class?: string;
};

const Input = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, InputProps<T>>,
) => {
  const merged = mergeProps<InputProps[]>({ type: "text" }, props);
  const [local, rest] = splitProps(merged as InputProps, ["class", "type"]);

  return (
    <Polymorphic
      as="input"
      type={local.type}
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
};

export { Input };
