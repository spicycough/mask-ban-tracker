import {
  FormControlErrorMessage as ErrorMessagePrimitive,
  FormControlContext,
  FormControlLabel as LabelPrimitive,
} from "@kobalte/core";
import {
  Button as ButtonPrimitive,
  type ButtonRootProps,
} from "@kobalte/core/button";
import {
  type CheckboxControlProps,
  type CheckboxInputProps,
  type CheckboxLabelProps,
  Checkbox as CheckboxPrimitive,
  type CheckboxRootProps,
} from "@kobalte/core/checkbox";
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import {
  type RadioGroupItemControlProps,
  type RadioGroupItemInputProps,
  type RadioGroupItemLabelProps,
  RadioGroup as RadioGroupPrimitive,
  type RadioGroupRootProps,
} from "@kobalte/core/radio-group";
import {
  type SelectContentProps,
  type SelectHiddenSelectProps,
  type SelectMultipleSelectionOptions,
  Select as SelectPrimitive,
  type SelectRootProps,
  type SelectTriggerProps,
} from "@kobalte/core/select";
import {
  type TextFieldInputProps,
  TextField as TextFieldPrimitive,
  type TextFieldRootProps,
  type TextFieldTextAreaProps,
} from "@kobalte/core/text-field";
import type {
  FieldValues,
  FormStore,
  ResponseData,
} from "@modular-forms/solid";
import { type VariantProps, cva } from "class-variance-authority";
import { CheckIcon, Loader2Icon } from "lucide-solid";
import {
  type ComponentProps,
  For,
  Show,
  type ValidComponent,
  createEffect,
  createSignal,
  mergeProps,
  on,
  splitProps,
} from "solid-js";
import { buttonVariants } from "./button";
import { labelVariants } from "./label";

type SplitProps<T> = Array<keyof T>;

type Option = {
  label: string;
  value: string;
};

type FormTextFieldInputProps<
  T extends ValidComponent | HTMLElement = HTMLElement,
> = {
  multiline?: boolean;
} & (
  | ({
      multiline: false;
      ref: (element: T) => void;
    } & TextFieldInputProps<T>)
  | ({
      multiline: true;
      ref: (element: T) => void;
    } & {} & TextFieldTextAreaProps<T>)
);

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
);

export type FormTextFieldProps = Omit<TextFieldRootProps, "type"> & {
  type?: "text" | "email" | "tel" | "password" | "url" | "date";
} & FormTextFieldInputProps &
  VariantProps<typeof inputVariants> & {
    placeholder?: string;
    // validation props
    error: string;
    // label props
    label: string;
  };

export function FormTextField(props: FormTextFieldProps) {
  const [rootProps, inputProps, rest] = splitProps(
    props as FormTextFieldProps,
    // Root
    ["name", "value", "required", "disabled"] as SplitProps<TextFieldRootProps>,
    // Input
    ["placeholder", "ref", "onInput", "onChange", "onBlur"] as SplitProps<
      Omit<FormTextFieldInputProps, "multiline">
    >,
  );

  return (
    <TextFieldPrimitive
      {...rootProps}
      validationState={rest.error ? "invalid" : "valid"}
    >
      <Show when={rest.label}>
        <TextFieldPrimitive.Label class={labelVariants()}>
          {rest.label}
        </TextFieldPrimitive.Label>
      </Show>
      <Show
        when={rest.multiline}
        fallback={
          <TextFieldPrimitive.Input
            class={inputVariants()}
            {...inputProps}
            type={rest.type}
          />
        }
      >
        <TextFieldPrimitive.TextArea
          class={inputVariants()}
          {...inputProps}
          autoResize
        />
      </Show>
      <TextFieldPrimitive.ErrorMessage>
        {rest.error}
      </TextFieldPrimitive.ErrorMessage>
    </TextFieldPrimitive>
  );
}

type SelectRootSingleProps = Exclude<
  SelectRootProps<Option>,
  SelectMultipleSelectionOptions<Option>
>;

export type FormSelectProps = SelectRootSingleProps & {
  options: Option[];
} & SelectHiddenSelectProps &
  SelectTriggerProps &
  SelectContentProps & {
    label?: string | undefined;
    error: string;
  };

export function FormSelect(props: FormSelectProps) {
  const [rootProps, selectProps, triggerProps, contentProps, rest] = splitProps(
    props as FormSelectProps,
    // Root
    [
      "name",
      "placeholder",
      "options",
      "required",
      "disabled",
    ] as SplitProps<SelectRootSingleProps>,
    // Select
    [
      "ref",
      "placeholder",
      "onInput",
      "onChange",
      "onBlur",
    ] as SplitProps<SelectHiddenSelectProps>,
    // Trigger
    ["disabled"] as SplitProps<SelectTriggerProps>,
    // Content
    [
      "onCloseAutoFocus",
      "onInteractOutside",
      "onPointerDownOutside",
      "onFocusOutside",
    ] as SplitProps<SelectContentProps>,
  );

  const [getValue, setValue] = createSignal<Option>();

  createEffect(
    on(
      () => props.value,
      (next) => {
        const newValue = rootProps.options.find(
          (option) => option.value === next?.value,
        );
        setValue(newValue);
      },
    ),
  );

  return (
    <SelectPrimitive
      {...rootProps}
      multiple={false}
      value={getValue()}
      onChange={setValue}
      optionValue="value"
      optionTextValue="label"
      validationState={rest.error ? "invalid" : "valid"}
      itemComponent={(props) => (
        <SelectPrimitive.Item {...props}>
          <SelectPrimitive.ItemLabel>
            {props.item.textValue}
          </SelectPrimitive.ItemLabel>
          <SelectPrimitive.ItemIndicator>
            <CheckIcon class="size-4">
              <title>Checked</title>
            </CheckIcon>
          </SelectPrimitive.ItemIndicator>
        </SelectPrimitive.Item>
      )}
    >
      <Show when={rest.label}>
        <SelectPrimitive.Label>{rest.label}</SelectPrimitive.Label>
      </Show>
      <SelectPrimitive.HiddenSelect {...selectProps} />
      <SelectPrimitive.Trigger {...triggerProps}>
        <SelectPrimitive.Value<Option>>
          {(state) => state.selectedOption().label}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content {...contentProps}>
          <SelectPrimitive.Listbox />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
      <SelectPrimitive.ErrorMessage>{props.error}</SelectPrimitive.ErrorMessage>
    </SelectPrimitive>
  );
}

export type FormCheckboxProps = CheckboxRootProps &
  CheckboxInputProps &
  CheckboxControlProps &
  CheckboxLabelProps & {
    // validation props
    error: string;
    // label props
    label: string;
  };

export function FormCheckbox(props: FormCheckboxProps) {
  const [rootProps, inputProps, controlProps, labelProps, rest] = splitProps(
    props as FormCheckboxProps,
    // Root
    [
      "name",
      "value",
      "checked",
      "required",
      "disabled",
    ] as SplitProps<CheckboxRootProps>,
    // Input
    ["ref", "onInput", "onChange", "onBlur"] as SplitProps<CheckboxInputProps>,
    // Control
    ["id", "onClick", "onKeyDown"] as SplitProps<CheckboxControlProps>,
    // Label
    ["id", "ref"] as SplitProps<CheckboxLabelProps>,
  );

  return (
    <CheckboxPrimitive
      {...rootProps}
      validationState={rest.error ? "invalid" : "valid"}
    >
      <CheckboxPrimitive.Input {...inputProps} />
      <CheckboxPrimitive.Control {...controlProps}>
        <CheckboxPrimitive.Indicator>
          <CheckIcon class="size-4">
            <title>Checked</title>
          </CheckIcon>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Control>
      <CheckboxPrimitive.Label {...labelProps}>
        {rest.label}
      </CheckboxPrimitive.Label>
    </CheckboxPrimitive>
  );
}

export type FormRadioGroupProps = RadioGroupRootProps & {
  options: Option[];
} & RadioGroupItemInputProps &
  RadioGroupItemControlProps &
  RadioGroupItemLabelProps & {
    // validation props
    error: string;
    // label props
    label?: string | undefined;
  };

export function FormRadioGroup(props: FormRadioGroupProps) {
  const [rootProps, itemInputProps, itemControlProps, itemLabelProps, rest] =
    splitProps(
      props as FormRadioGroupProps,
      // Root
      [
        "name",
        "value",
        "required",
        "disabled",
      ] as SplitProps<RadioGroupRootProps>,
      // Item input
      [
        "ref",
        "onInput",
        "onChange",
        "onBlur",
      ] as SplitProps<RadioGroupItemInputProps>,
      // Item control
      ["id", "onClick", "onKeyDown"] as SplitProps<RadioGroupItemControlProps>,
      // Item label
      ["id", "ref"] as SplitProps<RadioGroupItemLabelProps>,
    );

  return (
    <RadioGroupPrimitive
      {...rootProps}
      validationState={rest.error ? "invalid" : "valid"}
    >
      <Show when={rest.label}>
        <RadioGroupPrimitive.Label>{rest.label}</RadioGroupPrimitive.Label>
      </Show>
      <div>
        <For each={rest.options}>
          {(option) => (
            <RadioGroupPrimitive.Item value={option.value}>
              <RadioGroupPrimitive.ItemInput {...itemInputProps} />
              <RadioGroupPrimitive.ItemControl {...itemControlProps}>
                <RadioGroupPrimitive.ItemIndicator />
              </RadioGroupPrimitive.ItemControl>
              <RadioGroupPrimitive.ItemLabel {...itemLabelProps}>
                {option.label}
              </RadioGroupPrimitive.ItemLabel>
            </RadioGroupPrimitive.Item>
          )}
        </For>
      </div>
      <RadioGroupPrimitive.ErrorMessage>
        {rest.error}
      </RadioGroupPrimitive.ErrorMessage>
    </RadioGroupPrimitive>
  );
}

type FieldRootProps<T extends ValidComponent = "div"> = PolymorphicProps<
  T,
  ComponentProps<T>
>;

export type FormSubmitButtonProps<TFieldValues extends FieldValues> =
  FieldRootProps &
    Omit<ButtonRootProps, "type"> &
    VariantProps<typeof buttonVariants> & {
      type?: "submit" | "reset" | "button";
    } & {
      form?: FormStore<TFieldValues>;
      // validation props
      error: string;
      // label props
      label?: string;
    };

export const FormSubmitButton = <TFieldValues extends FieldValues>(
  props: FormSubmitButtonProps<TFieldValues>,
) => {
  const [rootProps, buttonProps, variantProps, rest] = splitProps(
    props as FormSubmitButtonProps<TFieldValues>,
    // Root
    ["class"] as SplitProps<FieldRootProps>,
    // Button
    [
      "name",
      "value",
      "required",
      "disabled",
      "type",
    ] as SplitProps<ButtonRootProps>,
    // Variant
    ["variant", "size"] as SplitProps<VariantProps<typeof buttonVariants>>,
  );

  return (
    <FormControlContext.Provider value={FormControlContext.defaultValue}>
      <Polymorphic as="div" {...rootProps}>
        <Show when={rest.label}>
          <LabelPrimitive>{rest.label}</LabelPrimitive>
        </Show>
        <ButtonPrimitive
          {...buttonProps}
          class={buttonVariants(
            mergeProps({
              size: variantProps.size ?? "sm",
              variant: variantProps.variant ?? "outline",
            }),
          )}
          disabled={buttonProps.disabled || rest.form?.submitting}
          type={buttonProps.type}
          validationState={rest.error ? "invalid" : "valid"}
        >
          <span classList={{ "opacity-0": props.form?.submitting }}>
            {props.children}
          </span>
          <Show when={props.form?.submitting}>
            <div class="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
              <Loader2Icon class="h-4 w-4 animate-spin" />
            </div>
          </Show>
        </ButtonPrimitive>
        <Show when={props.form?.invalid}>
          <div>{rest.error}</div>
        </Show>
      </Polymorphic>
    </FormControlContext.Provider>
  );
};
