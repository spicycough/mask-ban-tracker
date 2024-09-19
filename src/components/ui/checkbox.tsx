import { cn } from "@/lib/utils";
import type {
  CheckboxRootProps,
  CheckboxControlProps as KobalteCheckboxControlProps,
  CheckboxDescriptionProps as KobalteCheckboxDescriptionProps,
  CheckboxErrorMessageProps as KobalteCheckboxErrorMessageProps,
  CheckboxInputProps as KobalteCheckboxInputProps,
  CheckboxLabelProps as KobalteCheckboxLabelProps,
} from "@kobalte/core/checkbox";
import { Checkbox as CheckboxPrimitive } from "@kobalte/core/checkbox";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { CheckIcon, MinusIcon } from "lucide-solid";
import type { ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

// Root
export const Checkbox = CheckboxPrimitive;
export type CheckboxProps<T extends ValidComponent = "div"> =
  CheckboxRootProps<T> & {
    class?: string;
  };

// Forms
export const CheckboxLabel = CheckboxPrimitive.Label;
export type CheckboxLabelProps<T extends ValidComponent = "label"> = VoidProps<
  KobalteCheckboxLabelProps<T> & { class?: string }
>;

export const CheckboxDescription = CheckboxPrimitive.Description;
export type CheckboxDescriptionProps<T extends ValidComponent = "p"> =
  VoidProps<KobalteCheckboxDescriptionProps<T> & { class?: string }>;

export const CheckboxErrorMessage = CheckboxPrimitive.ErrorMessage;
export type CheckboxErrorMessageProps<T extends ValidComponent = "p"> =
  VoidProps<KobalteCheckboxErrorMessageProps<T> & { class?: string }>;

export type CheckboxInputProps<T extends ValidComponent = "input"> = VoidProps<
  KobalteCheckboxInputProps<T> & { class?: string; indeterminate?: boolean }
>;

export const CheckboxInput = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, CheckboxInputProps<T>>,
) => {
  const [local, rest] = splitProps(props as CheckboxInputProps, ["class"]);

  return (
    <CheckboxPrimitive.Input
      class={cn(
        "[&:focus-visible+div]:outline-none [&:focus-visible+div]:ring-[1.5px] [&:focus-visible+div]:ring-ring [&:focus-visible+div]:ring-offset-2 [&:focus-visible+div]:ring-offset-background",
        local.class,
      )}
      {...rest}
    />
  );
};

export type CheckboxControlProps<T extends ValidComponent = "div"> = VoidProps<
  KobalteCheckboxControlProps<T> &
    KobalteCheckboxInputProps & {
      class?: string;
      indeterminate?: boolean;
    }
>;

export const CheckboxControl = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CheckboxControlProps<T>>,
) => {
  const [local, inputProps, rest] = splitProps(
    props as CheckboxControlProps,
    // Local
    ["class", "children", "indeterminate"],
    // Input props
    ["ref", "onInput", "onChange", "onBlur"] as Array<keyof CheckboxInputProps>,
  );

  return (
    <>
      <CheckboxInput {...inputProps} />
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
          >
            <title>{local.indeterminate ? "Indeterminate" : "Checked"}</title>
          </Dynamic>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Control>
    </>
  );
};

export const Example = () => {
  return (
    <Checkbox class="flex items-start space-x-2">
      <CheckboxControl />
      <div class="grid gap-1.5 leading-none">
        <CheckboxLabel class="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Accept terms and conditions
        </CheckboxLabel>
        <CheckboxDescription class="text-muted-foreground text-sm">
          You agree to our Terms of Service and Privacy Policy.
        </CheckboxDescription>
      </div>
    </Checkbox>
  );
};
