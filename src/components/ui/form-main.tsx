import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "@kobalte/core";
import {
  FormControlDescription,
  FormControlErrorMessage,
  FormControlLabel,
  type FormControlDescriptionProps as KobalteFormControlDescriptionProps,
  type FormControlErrorMessageProps as KobalteFormControlErrorMessageProps,
} from "@kobalte/core";
import {
  Field,
  type FieldPath,
  type FieldPathValue,
  type FieldProps,
  type FieldValues,
  type FormStore,
  type MaybeValue,
  Form as ModularForm,
  type PartialKey,
  type ResponseData,
  validate,
} from "@modular-forms/solid";
import {
  type ComponentProps,
  type ContextProviderComponent,
  type ParentProps,
  Show,
  type ValidComponent,
  createContext,
  createUniqueId,
  splitProps,
  untrack,
  useContext,
} from "solid-js";
import { Slot, type SlotProps } from "./slot";

type FormContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TResponseData extends ResponseData = ResponseData,
> = FormStore<TFieldValues, TResponseData>;

/** FORM */

const FormContext = createContext<FormContextValue>({} as FormContextValue);

const Form: ContextProviderComponent<FormContextValue> = (props) => {
  return (
    <FormContext.Provider value={props.value}>
      <ModularForm of={props.value}>{props.children}</ModularForm>
    </FormContext.Provider>
  );
};

const useFormContext = () => {
  const formContext = useContext(FormContext);

  if (!formContext) {
    throw new Error("useFormContext should be used within <Form>");
  }

  return formContext;
};

/** FORM FIELD */

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData,
  TFieldName extends FieldPath<TFieldValues>,
>(
  props: FieldPathValue<TFieldValues, TFieldName> extends MaybeValue<string>
    ? PartialKey<FieldProps<TFieldValues, TResponseData, TFieldName>, "type">
    : FieldProps<TFieldValues, TResponseData, TFieldName>,
) => {
  const form = useFormContext();
  const [local, rest] = splitProps(props, ["of", "name"]);

  return (
    <Field of={local.of} name={local.name} {...rest}>
      {(field, props) => (
        <FormFieldContext.Provider value={{ name: field.name }}>
          <FormControl />
        </FormFieldContext.Provider>
      )}
    </Field>
  );
};

const useFormField = () => {
  const formField = useContext(FormFieldContext);
  const formItem = useContext(FormItemContext);
  const form = useFormContext();

  const fieldState = getFieldState(form, formField.name);

  if (!formField) {
    throw new Error("useFormField should be used within <FormField>");
  }

  return {
    id: formItem.id,
    name: formField.name,
    formItemId: `${formItem.id}-form-item`,
    formDescriptionId: `${formItem.id}-form-item-description`,
    formMessageId: `${formItem.id}-form-item-message`,
    // Field state
    isDirty: fieldState?.dirty,
    isTouched: fieldState?.touched,
    error: fieldState?.error,
    invalid: fieldState?.invalid,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

type FormItemProps<T extends ValidComponent = "div"> = ComponentProps<T>;

export const FormItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FormItemProps<T>>,
) => {
  const [local, rest] = splitProps(props as FormItemProps, ["class"]);

  const id = createUniqueId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div class={cn("space-y-2", local.class)} {...rest} />
    </FormItemContext.Provider>
  );
};

export type FormLabelProps<T extends ValidComponent = "label"> =
  KobalteFormControlErrorMessageProps<T> &
    ParentProps<{
      class?: string;
    }>;

export const FormLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, FormLabelProps<T>>,
) => {
  const [local, rest] = splitProps(props as FormLabelProps, ["class"]);

  const { error, formItemId } = useFormField();

  return (
    <FormControlLabel
      class={cn(error && "text-destructive", local.class)}
      for={formItemId}
      {...rest}
    />
  );
};

export type FormControlProps<T extends ValidComponent = "div"> =
  ComponentProps<T>;

export const FormControl = (props: SlotProps) => {
  const formField = useFormField();

  return (
    <Slot
      id={formField.formItemId}
      aria-describedby={
        !formField.error
          ? `${formField.formDescriptionId}`
          : `${formField.formDescriptionId} ${formField.formMessageId}`
      }
      aria-invalid={!!formField.error}
      {...props}
    />
  );
};

type FormDescriptionProps<T extends ValidComponent = "div"> =
  KobalteFormControlDescriptionProps<T> &
    ParentProps<{
      class?: string;
    }>;

export const FormDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FormDescriptionProps<T>>,
) => {
  const [local, rest] = splitProps(props as FormDescriptionProps, ["class"]);

  const formField = useFormField();

  return (
    <FormControlDescription
      id={formField.formDescriptionId}
      class={cn("text-muted-foreground text-sm", local.class)}
      {...rest}
    />
  );
};

export type FormErrorMessageProps<T extends ValidComponent = "div"> =
  KobalteFormControlErrorMessageProps<T> &
    ParentProps<{
      class?: string;
    }>;

export const FormErrorMessage = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, FormErrorMessageProps<T>>,
) => {
  const [local, rest] = splitProps(props as FormErrorMessageProps, [
    "class",
    "children",
  ]);

  const formField = useFormField();

  return (
    <Show
      when={formField.error ? String(formField.error?.message) : local.children}
    >
      {(body) => (
        <FormControlErrorMessage
          id={formField.formMessageId}
          class={cn("font-medium text-destructive text-sm", local.class)}
          {...rest}
        >
          {body()}
        </FormControlErrorMessage>
      )}
    </Show>
  );
};

/**
 * Returns the RAW state of the field.
 *
 * @param form The form of the field.
 * @param name The name of the field.
 *
 * @returns The state of the field.
 */
function getFieldState<
  TFieldValues extends FieldValues = FieldValues,
  TResponseData extends ResponseData = ResponseData,
>(form: FormStore<TFieldValues, TResponseData>, name: FieldPath<TFieldValues>) {
  const field = form.internal.fields[name];
  return field
    ? untrack(() => ({
        startValue: field.startValue.get(),
        value: field.value.get(),
        touched: field.touched.get(),
        dirty: field.dirty.get(),
        error: field.error.get() ? new Error(field.error.get()) : undefined,
        invalid: validate(form, name, {
          shouldActive: true,
          shouldFocus: true,
        }),
      }))
    : undefined;
}
