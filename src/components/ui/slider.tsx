import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "@kobalte/core";
import type {
  SliderFillProps as KobalteSliderFillProps,
  SliderLabelProps as KobalteSliderLabelProps,
  SliderRootProps as KobalteSliderRootProps,
  SliderThumbProps as KobalteSliderThumbProps,
  SliderTrackProps as KobalteSliderTrackProps,
  SliderValueLabelProps as KobalteSliderValueLabelProps,
} from "@kobalte/core/slider";
import { Slider as SliderPrimitive } from "@kobalte/core/slider";
import { type ValidComponent, splitProps } from "solid-js";
import { Label } from "./label";

// Form
export const SliderErrorMessage = SliderPrimitive.ErrorMessage;
export type SliderErrorMessageProps = KobalteSliderLabelProps & {
  class?: string;
};

export type SliderProps<T extends ValidComponent = "div"> =
  KobalteSliderRootProps<T> & {
    class?: string;
  };

export const Slider = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SliderProps<T>>,
) => {
  const [local, rest] = splitProps(props as SliderProps, ["class"]);

  return (
    <SliderPrimitive
      class={cn(
        "relative flex w-full touch-none select-none flex-col items-center",
        local.class,
      )}
      {...rest}
    />
  );
};

export type SliderTrackProps<T extends ValidComponent = "div"> =
  KobalteSliderTrackProps<T> & {
    class?: string;
  };

export const SliderTrack = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SliderTrackProps<T>>,
) => {
  const [local, rest] = splitProps(props as SliderTrackProps, ["class"]);

  return (
    <SliderPrimitive.Track
      class={cn(
        "relative h-2 w-full grow rounded-full bg-secondary",
        local.class,
      )}
      {...rest}
    />
  );
};

export type SliderFillProps<T extends ValidComponent = "div"> =
  KobalteSliderFillProps<T> & {
    class?: string;
  };

export const SliderFill = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SliderFillProps<T>>,
) => {
  const [local, rest] = splitProps(props as SliderFillProps, ["class"]);

  return (
    <SliderPrimitive.Fill
      class={cn("absolute h-full rounded-full bg-primary", local.class)}
      {...rest}
    />
  );
};

export type SliderThumbProps<T extends ValidComponent = "span"> =
  KobalteSliderThumbProps<T> & {
    class?: string;
  };

export const SliderThumb = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, SliderThumbProps<T>>,
) => {
  const [local, rest] = splitProps(props as SliderThumbProps, ["class"]);

  return (
    <SliderPrimitive.Thumb
      class={cn(
        "-top-1.5 block size-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        local.class,
      )}
      {...rest}
    >
      <SliderPrimitive.Input />
    </SliderPrimitive.Thumb>
  );
};

export const SliderLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, KobalteSliderLabelProps<T>>,
) => {
  return <SliderPrimitive.Label as={Label} {...props} />;
};

export const SliderValueLabel = <T extends ValidComponent = "label">(
  props: PolymorphicProps<T, KobalteSliderValueLabelProps<T>>,
) => {
  return <SliderPrimitive.ValueLabel as={Label} {...props} />;
};

export const Example = () => {
  return (
    <Slider>
      <SliderValueLabel />
      <SliderTrack>
        <SliderFill />
        <SliderThumb />
      </SliderTrack>
    </Slider>
  );
};
