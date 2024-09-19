import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type {
  RadioGroupDescriptionProps as KobalteRadioDescriptionProps,
  RadioGroupItemControlProps as KobalteRadioGroupItemControlProps,
  RadioGroupItemInputProps as KobalteRadioGroupItemInputProps,
  RadioGroupItemLabelProps as KobalteRadioGroupItemLabelProps,
  RadioGroupItemProps as KobalteRadioGroupItemProps,
  RadioGroupRootProps as KobalteRadioGroupProps,
} from "@kobalte/core/radio-group";
import { RadioGroup as RadioGroupPrimitive } from "@kobalte/core/radio-group";
import type { ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";

// Root
export const RadioGroup = RadioGroupPrimitive;
export type RadioGroupProps<T extends ValidComponent = "div"> = VoidProps<
  KobalteRadioGroupProps<T> & { class?: string }
>;

export const RadioGroupDescription = RadioGroupPrimitive.Description;
export type RadioGroupDescriptionProps<T extends ValidComponent = "p"> =
  VoidProps<KobalteRadioDescriptionProps<T> & { class?: string }>;

// Item
export const RadioGroupItem = RadioGroupPrimitive.Item;
export type RadioGroupItemProps<T extends ValidComponent = "div"> = VoidProps<
  KobalteRadioGroupItemProps<T> & { class?: string }
>;

export const RadioGroupItemInput = RadioGroupPrimitive.ItemInput;
export type RadioGroupItemInputProps<T extends ValidComponent = "input"> =
  VoidProps<KobalteRadioGroupItemInputProps<T> & { class?: string }>;

export const RadioGroupItemLabel = RadioGroupPrimitive.ItemLabel;
export type RadioGroupItemLabelProps<T extends ValidComponent = "label"> =
  VoidProps<KobalteRadioGroupItemLabelProps<T> & { class?: string }>;

export const RadioGroupItemDescription = RadioGroupPrimitive.ItemDescription;
export const RadioGroupItemIndicator = RadioGroupPrimitive.ItemIndicator;

// Forms
export const RadioGroupLabel = RadioGroupPrimitive.Label;
export const RadioGroupErrorMessage = RadioGroupPrimitive.ErrorMessage;

export type RadioGroupItemControlProps<T extends ValidComponent = "div"> =
  VoidProps<KobalteRadioGroupItemControlProps<T> & { class?: string }>;

export const RadioGroupItemControl = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, RadioGroupItemControlProps<T>>,
) => {
  const [local, rest] = splitProps(props as RadioGroupItemControlProps, [
    "class",
  ]);

  return (
    <RadioGroupPrimitive.ItemControl
      class={cn(
        "flex aspect-square h-4 w-4 items-center justify-center rounded-full border border-primary text-primary shadow transition-shadow focus:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-foreground",
        local.class,
      )}
      {...rest}
    >
      <RadioGroupPrimitive.ItemIndicator class="h-2 w-2 rounded-full data-[checked]:bg-background" />
    </RadioGroupPrimitive.ItemControl>
  );
};

export const Example = () => {
  return (
    <RadioGroup defaultValue="option-one">
      <RadioGroupItem value="option-one" />
      <RadioGroupItem value="option-two" />
    </RadioGroup>
  );
};
