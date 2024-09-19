import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { TextFieldInputProps as KobalteTextFieldInputProps } from "@kobalte/core/text-field";
import { Input as InputPrimitive } from "@kobalte/core/text-field";
import { type ValidComponent, type VoidProps, splitProps } from "solid-js";

export type InputProps<T extends ValidComponent = "input"> = VoidProps<
  KobalteTextFieldInputProps<T> & {
    type?: "text" | "email" | "password" | "number" | "tel" | "url";
    class?: string;
  }
>;

export const Input = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, InputProps<T>>,
) => {
  const [local, rest] = splitProps(props as InputProps, ["class"]);

  return (
    <InputPrimitive
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
};
