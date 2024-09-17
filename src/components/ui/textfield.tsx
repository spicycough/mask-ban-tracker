import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type {
  TextFieldDescriptionProps as KobalteTextFieldDescriptionProps,
  TextFieldErrorMessageProps as KobalteTextFieldErrorMessageProps,
  TextFieldInputProps as KobalteTextFieldInputProps,
  TextFieldLabelProps as KobalteTextFieldLabelProps,
  TextFieldRootProps as KobalteTextFieldRootProps,
} from "@kobalte/core/text-field";
import { TextField as TextFieldPrimitive } from "@kobalte/core/text-field";
import { cva } from "class-variance-authority";
import type { ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";

export type TextFieldProps<T extends ValidComponent = "div"> =
  KobalteTextFieldRootProps<T> & {
    class?: string;
  };

export const TextFieldRoot = <T extends ValidComponent = "div">(
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

export type TextFieldInputProps<T extends ValidComponent = "input"> = VoidProps<
  KobalteTextFieldInputProps<T> & {
    class?: string;
  }
>;

export const TextField = <T extends ValidComponent = "input">(
  props: PolymorphicProps<T, TextFieldInputProps<T>>,
) => {
  const [local, rest] = splitProps(props as TextFieldInputProps, ["class"]);

  return (
    <TextFieldPrimitive.Input
      class={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        local.class,
      )}
      {...rest}
    />
  );
};
