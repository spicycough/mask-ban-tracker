import type { SelectMultipleSelectionOptions } from "@kobalte/core/select";
import type { FieldValues, FormStore } from "@modular-forms/solid";
import { Loader2Icon } from "lucide-solid";
import {
  type ComponentProps,
  For,
  Show,
  createEffect,
  createSignal,
  on,
  splitProps,
} from "solid-js";
import { Button, type ButtonProps } from "./button";
import {
  Checkbox,
  CheckboxControl,
  type CheckboxControlProps,
  type CheckboxInputProps,
  CheckboxLabel,
  type CheckboxLabelProps,
  type CheckboxProps,
} from "./checkbox";
import { Label, labelVariants } from "./label";
import {
  RadioGroup,
  RadioGroupErrorMessage,
  RadioGroupItem,
  RadioGroupItemControl,
  type RadioGroupItemControlProps,
  RadioGroupItemInput,
  type RadioGroupItemInputProps,
  RadioGroupItemLabel,
  type RadioGroupItemLabelProps,
  RadioGroupLabel,
  type RadioGroupProps,
} from "./radio-group";
import {
  Select,
  SelectContent,
  type SelectContentProps,
  SelectErrorMessage,
  SelectHiddenSelect,
  type SelectHiddenSelectProps,
  SelectItem,
  SelectLabel,
  type SelectProps,
  SelectTrigger,
  type SelectTriggerProps,
  SelectValue,
} from "./select";
import {
  Slider,
  SliderFill,
  type SliderFillProps,
  SliderLabel,
  type SliderProps,
  SliderThumb,
  type SliderThumbProps,
  SliderTrack,
  type SliderTrackProps,
  SliderValueLabel,
} from "./slider";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldInput,
  type TextFieldInputProps,
  TextFieldLabel,
  type TextFieldProps,
} from "./textfield";

type SplitProps<T> = Array<keyof T>;

type Option = {
  label: string;
  value: string;
};

export type FormTextFieldProps = TextFieldProps &
  TextFieldInputProps & {
    // validation props
    error: string;
    // label props
    label: string;
  };

export function FormTextField(props: FormTextFieldProps) {
  const [rootProps, inputProps, rest] = splitProps(
    props as FormTextFieldProps,
    // Root
    [
      "name",
      "value",
      "required",
      "disabled",
      "class",
    ] as SplitProps<TextFieldProps>,
    // Input
    [
      "multiline",
      "placeholder",
      "ref",
      "onInput",
      "onChange",
      "onBlur",
    ] as SplitProps<TextFieldInputProps>,
  );

  return (
    <TextField
      {...rootProps}
      validationState={rest.error ? "invalid" : "valid"}
    >
      <Show when={rest.label}>
        <TextFieldLabel class={labelVariants()}>{rest.label}</TextFieldLabel>
      </Show>
      <TextFieldInput {...inputProps} />
      <TextFieldErrorMessage>{rest.error}</TextFieldErrorMessage>
    </TextField>
  );
}

type SelectRootSingleProps<TOption extends Option> = Exclude<
  SelectProps<TOption>,
  SelectMultipleSelectionOptions<TOption>
>;

export type FormSelectProps<TOption extends Option> =
  SelectRootSingleProps<TOption> & {
    options: TOption[];
  } & SelectHiddenSelectProps &
    SelectTriggerProps &
    SelectContentProps & {
      label?: string | undefined;
      error: string;
    };

export function FormSelect<TOption extends Option>(
  props: FormSelectProps<TOption>,
) {
  const [rootProps, selectProps, triggerProps, contentProps, rest] = splitProps(
    props as FormSelectProps<TOption>,
    // Root
    ["name", "placeholder", "options", "required", "disabled"] as SplitProps<
      SelectRootSingleProps<TOption>
    >,
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

  const [getValue, setValue] = createSignal<TOption>();

  createEffect(
    on(
      () => props.value,
      (newValue) => {
        return setValue(() => {
          return props.options.find((option) => option.value === newValue);
        });
      },
    ),
    props.value,
    { name: "FormSelect" },
  );

  return (
    <Select<TOption>
      {...rootProps}
      multiple={false}
      value={getValue()}
      onChange={setValue}
      optionValue="value"
      optionTextValue="label"
      // optionTextValue={(option) => toTitlecase(option?.label)}
      itemComponent={(props) => (
        <SelectItem {...props}>{props.item.textValue}</SelectItem>
      )}
      validationState={rest.error ? "invalid" : "valid"}
    >
      <Show when={rest.label}>
        <SelectLabel class={labelVariants()}>{rest.label}</SelectLabel>
      </Show>
      <SelectHiddenSelect {...selectProps} />
      <SelectTrigger {...triggerProps}>
        <SelectValue<TOption>>
          {(state) => state.selectedOption().label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent {...contentProps} />
      <SelectErrorMessage>{props.error}</SelectErrorMessage>
    </Select>
  );
}

export type FormCheckboxProps = CheckboxProps &
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
    ] as SplitProps<CheckboxProps>,
    // Input
    ["ref", "onInput", "onChange", "onBlur"] as SplitProps<CheckboxInputProps>,
    // Control
    ["id", "onClick", "onKeyDown"] as SplitProps<CheckboxControlProps>,
    // Label
    ["id", "ref"] as SplitProps<CheckboxLabelProps>,
  );

  return (
    <Checkbox {...rootProps} validationState={rest.error ? "invalid" : "valid"}>
      <CheckboxControl {...inputProps} {...controlProps} />
      <CheckboxLabel {...labelProps}>{rest.label}</CheckboxLabel>
    </Checkbox>
  );
}

export type FormRadioGroupProps = RadioGroupProps & {
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
      ["name", "value", "required", "disabled"] as SplitProps<RadioGroupProps>,
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
    <RadioGroup
      {...rootProps}
      validationState={rest.error ? "invalid" : "valid"}
    >
      <Show when={rest.label}>
        <RadioGroupLabel>{rest.label}</RadioGroupLabel>
      </Show>
      <div>
        <For each={rest.options}>
          {(option) => (
            <RadioGroupItem value={option.value}>
              <RadioGroupItemInput {...itemInputProps} />
              <RadioGroupItemControl {...itemControlProps} />
              <RadioGroupItemLabel {...itemLabelProps}>
                {option.label}
              </RadioGroupItemLabel>
            </RadioGroupItem>
          )}
        </For>
      </div>
      <RadioGroupErrorMessage>{rest.error}</RadioGroupErrorMessage>
    </RadioGroup>
  );
}

export type FormSliderProps = SliderProps &
  SliderFillProps &
  SliderTrackProps &
  SliderThumbProps & {
    // validation props
    error: string;
    // label props
    label: string;
  };

export function FormSlider(props: FormSliderProps) {
  const [rootProps, trackProps, thumbProps, rest] = splitProps(
    props as FormSliderProps,
    // Root
    [
      "name",
      "value",
      "required",
      "disabled",
      "class",
    ] as SplitProps<SliderProps>,
    // Track
    [
      "onPointerUp",
      "onPointerDown",
      "onPointerMove",
    ] as SplitProps<SliderTrackProps>,
    // Thumb
    ["onBlur", "onFocus", "onKeyDown"] as SplitProps<SliderThumbProps>,
  );

  return (
    <Slider {...rootProps} validationState={rest.error ? "invalid" : "valid"}>
      <Show when={rest.label}>
        <SliderLabel>{rest.label}</SliderLabel>
      </Show>
      <SliderTrack {...trackProps}>
        <SliderFill />
        <For each={props.value}>
          {(value) => <SliderThumb value={value} {...thumbProps} />}
        </For>
      </SliderTrack>
      <div class="mt-2 flex w-full items-center justify-between">
        <For each={props.value}>{(value, idx) => <Label>{value}</Label>}</For>
      </div>
    </Slider>
  );
}

export type FormSubmitButtonProps<TFieldValues extends FieldValues> =
  ComponentProps<"div"> &
    ButtonProps & {
      form?: FormStore<TFieldValues>;
      // validation props
      error: string;
      // label props
      label?: string;
    };

export const FormSubmitButton = <TFieldValues extends FieldValues>(
  props: FormSubmitButtonProps<TFieldValues>,
) => {
  const [rootProps, buttonProps, rest] = splitProps(
    props as FormSubmitButtonProps<TFieldValues>,
    // Root
    ["class"] as SplitProps<ComponentProps<"div">>,
    // Button
    [
      "name",
      "value",
      "required",
      "disabled",
      "type",
      "variant",
      "size",
    ] as SplitProps<ButtonProps>,
  );

  return (
    <div {...rootProps}>
      <Show when={rest.label}>
        <Label>{rest.label}</Label>
      </Show>
      <Button
        {...buttonProps}
        disabled={buttonProps.disabled || rest.form?.submitting}
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
      </Button>
      <Show when={props.form?.invalid}>
        <Label>{rest.error}</Label>
      </Show>
    </div>
  );
};
