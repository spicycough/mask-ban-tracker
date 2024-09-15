import { cn } from "@/lib/utils";
import type {
  ImageFallbackProps as KobalteImageFallbackProps,
  ImageImgProps as KobalteImageImgProps,
  ImageRootProps as KobalteImageRootProps,
} from "@kobalte/core/image";
import { Image as ImagePrimitive } from "@kobalte/core/image";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

export type ImageRootProps<T extends ValidComponent = "span"> =
  KobalteImageRootProps<T> & {
    class?: string;
  };

export const ImageRoot = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, ImageRootProps<T>>,
) => {
  const [local, rest] = splitProps(props as ImageRootProps, ["class"]);

  return (
    <ImagePrimitive
      class={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        local.class,
      )}
      {...rest}
    />
  );
};

export type ImageProps<T extends ValidComponent = "img"> =
  KobalteImageImgProps<T> & {
    class?: string;
  };

export const Image = <T extends ValidComponent = "img">(
  props: PolymorphicProps<T, ImageProps<T>>,
) => {
  const [local, rest] = splitProps(props as ImageProps, ["class"]);

  return (
    <ImagePrimitive.Img
      class={cn("aspect-square h-full w-full", local.class)}
      {...rest}
    />
  );
};

export type ImageFallbackProps<T extends ValidComponent = "span"> =
  KobalteImageFallbackProps<T> & {
    class?: string;
  };

export const ImageFallback = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, ImageFallbackProps<T>>,
) => {
  const [local, rest] = splitProps(props as ImageFallbackProps, ["class"]);

  return (
    <ImagePrimitive.Fallback
      class={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        local.class,
      )}
      {...rest}
    />
  );
};
