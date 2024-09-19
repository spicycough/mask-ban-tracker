import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type {
  TextFieldDescriptionProps as KobalteTextFieldDescriptionProps,
  TextFieldErrorMessageProps as KobalteTextFieldErrorMessageProps,
  TextFieldInputProps as KobalteTextFieldInputProps,
  TextFieldLabelProps as KobalteTextFieldLabelProps,
  TextFieldRootProps as KobalteTextFieldRootProps,
  TextFieldTextAreaProps as KobalteTextFieldTextAreaProps,
} from "@kobalte/core/text-field";
import { TextField as TextFieldPrimitive } from "@kobalte/core/text-field";
import { cva } from "class-variance-authority";
import type { ValidComponent, VoidProps } from "solid-js";
import { Show, splitProps } from "solid-js";
import { Input } from "./input";
import { TextArea } from "./textarea";

export type TextFieldProps<T extends ValidComponent = "div"> =
  KobalteTextFieldRootProps<T> & {
    class?: string;
  };

export const TextField = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TextFieldProps<T>>,
) => {
  const [local, rest] = splitProps(props as TextFieldProps, ["class"]);

  return <TextFieldPrimitive class={cn("space-y-1", local.class)} {...rest} />;
};

export const textfieldLabelVariants = cva(
  "text-sm data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70 font-medium",
  {
    variants: {
      label: {
        true: "data-[invalid]:text-destructive",
      },
      error: {
        true: "text-destructive text-xs",
      },
      description: {
        true: "font-normal text-muted-foreground",
      },
    },
    defaultVariants: {
      label: true,
    },
  },
);

export type TextFieldLabelProps<T extends ValidComponent = "label"> =
  KobalteTextFieldLabelProps<T> & {
    class?: string;
  };

export const TextFieldLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, TextFieldLabelProps<T>>,
) => {
  const [local, rest] = splitProps(props as TextFieldLabelProps, ["class"]);

  return (
    <TextFieldPrimitive.Label
      class={cn(textfieldLabelVariants(), local.class)}
      {...rest}
    />
  );
};

export type TextFieldErrorMessageProps<T extends ValidComponent = "div"> =
  KobalteTextFieldErrorMessageProps<T> & {
    class?: string;
  };

export const TextFieldErrorMessage = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TextFieldErrorMessageProps<T>>,
) => {
  const [local, rest] = splitProps(props as TextFieldErrorMessageProps, [
    "class",
  ]);

  return (
    <TextFieldPrimitive.ErrorMessage
      class={cn(textfieldLabelVariants({ error: true }), local.class)}
      {...rest}
    />
  );
};

export type TextFieldDescriptionProps<T extends ValidComponent = "div"> =
  KobalteTextFieldDescriptionProps<T> & {
    class?: string;
  };

export const TextFieldDescription = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, TextFieldDescriptionProps<T>>,
) => {
  const [local, rest] = splitProps(props as TextFieldDescriptionProps, [
    "class",
  ]);

  return (
    <TextFieldPrimitive.Description
      class={cn(
        textfieldLabelVariants({ description: true, label: false }),
        local.class,
      )}
      {...rest}
    />
  );
};

type DiscriminatedInputProps<T extends ValidComponent = "input"> =
  | (KobalteTextFieldInputProps<T> & {
      multiline?: false;
    })
  | (KobalteTextFieldTextAreaProps<T> & {
      multiline: true;
    });

export type TextFieldInputProps<T extends ValidComponent = "input"> = VoidProps<
  DiscriminatedInputProps<T> & {
    class?: string;
  }
>;

export const TextFieldInput = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, TextFieldInputProps<T>>,
) => {
  const [local, rest] = splitProps(props as TextFieldInputProps, [
    "class",
    "multiline",
  ]);

  return (
    <Show when={local.multiline} fallback={<Input {...rest} />}>
      <TextArea {...rest} />
    </Show>
  );
};

export type TextFieldTextAreaProps<T extends ValidComponent = "textarea"> =
  VoidProps<
    KobalteTextFieldTextAreaProps<T> & {
      class?: string;
    }
  >;
