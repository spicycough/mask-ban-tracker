import { cn } from "@/lib/utils";
import type {
  CheckboxRootProps,
  CheckboxControlProps as KobalteCheckboxControlProps,
} from "@kobalte/core/checkbox";
import { Checkbox as CheckboxPrimitive } from "@kobalte/core/checkbox";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { CheckIcon, MinusIcon } from "lucide-solid";
import type { ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

// export const Checkbox = CheckboxPrimitive;
export const CheckboxLabel = CheckboxPrimitive.Label;
export const CheckboxErrorMessage = CheckboxPrimitive.ErrorMessage;
export const CheckboxDescription = CheckboxPrimitive.Description;

export type CheckboxControlProps<T extends ValidComponent = "div"> = VoidProps<
  KobalteCheckboxControlProps<T> & { class?: string; indeterminate?: boolean }
>;

export const CheckboxControl = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CheckboxControlProps<T>>,
) => {
  const [local, rest] = splitProps(props as CheckboxControlProps, [
    "class",
    "children",
    "indeterminate",
  ]);

  return (
    <>
      <CheckboxPrimitive.Input class="[&:focus-visible+div]:outline-none [&:focus-visible+div]:ring-[1.5px] [&:focus-visible+div]:ring-ring [&:focus-visible+div]:ring-offset-2 [&:focus-visible+div]:ring-offset-background" />
      <CheckboxPrimitive.Control
        class={cn(
          "h-4 w-4 shrink-0 rounded-sm border border-primary shadow transition-shadow focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring data-[disabled]:cursor-not-allowed data-[checked]:bg-primary data-[checked]:text-primary-foreground data-[disabled]:opacity-50",
          local.class,
        )}
        {...rest}
      >
        <CheckboxPrimitive.Indicator class="group flex items-center justify-center text-current">
          <Dynamic
            component={local.indeterminate ? MinusIcon : CheckIcon}
            class="h-4 w-4"
          />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Control>
    </>
  );
};

type CheckboxProps<T extends ValidComponent = "div"> = CheckboxRootProps<T> & {
  class?: string;
};

export const Checkbox = <T extends ValidComponent = "checkbox">(
  props: PolymorphicProps<T, CheckboxProps<T>>,
) => {
  const [local, rest] = splitProps(props as CheckboxProps, ["class"]);

  return (
    <CheckboxPrimitive class={cn("", local.class)} {...rest}>
      <CheckboxControl />
    </CheckboxPrimitive>
  );
};
