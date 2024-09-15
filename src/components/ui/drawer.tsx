import { cn } from "@/lib/utils";
import type {
  ContentProps,
  DescriptionProps,
  DynamicProps,
  LabelProps,
} from "@corvu/drawer";
import DrawerPrimitive from "@corvu/drawer";
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import type { ComponentProps, ParentProps, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";

export const Drawer = DrawerPrimitive;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;

export type DrawerContentProps<T extends ValidComponent = "div"> = ParentProps<
  ContentProps<T> & {
    class?: string;
  }
>;

export const DrawerContent = <T extends ValidComponent = "div">(
  props: DynamicProps<T, DrawerContentProps<T>>,
) => {
  const [local, rest] = splitProps(props as DrawerContentProps, [
    "class",
    "children",
  ]);
  const ctx = DrawerPrimitive.useContext();

  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay
        class="fixed inset-0 z-50 data-[transitioning]:transition-colors data-[transitioning]:duration-200"
        style={{
          "background-color": `hsl(var(--background) / ${0.8 * ctx.openPercentage()})`,
        }}
      />
      <DrawerPrimitive.Content
        class={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-xl border bg-background after:absolute after:inset-x-0 after:top-full after:h-[50%] after:bg-inherit data-[transitioning]:transition-transform data-[transitioning]:duration-200 md:select-none",
          local.class,
        )}
        {...rest}
      >
        <div class="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {local.children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
};

type DrawerHeaderProps<T extends ValidComponent = "div"> = ComponentProps<T> & {
  class?: string;
};

export const DrawerHeader = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DrawerHeaderProps<T>>,
) => {
  const [local, rest] = splitProps(props as DrawerHeaderProps, ["class"]);

  return (
    <Polymorphic
      as="div"
      class={cn("grid gap-1.5 p-4 text-center sm:text-left", local.class)}
      {...rest}
    />
  );
};

type DrawerFooterProps<T extends ValidComponent = "div"> = ComponentProps<T> & {
  class?: string;
};

export const DrawerFooter = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DrawerHeaderProps<T>>,
) => {
  const [local, rest] = splitProps(props as DrawerFooterProps, ["class"]);

  return (
    <Polymorphic
      as="div"
      class={cn("mt-auto flex flex-col gap-2 p-4", local.class)}
      {...rest}
    />
  );
};

export type DrawerLabelProps<T extends ValidComponent = "h2"> =
  LabelProps<T> & {
    class?: string;
  };

export const DrawerLabel = <T extends ValidComponent = "h2">(
  props: DynamicProps<T, DrawerLabelProps>,
) => {
  const [local, rest] = splitProps(props as DrawerLabelProps, ["class"]);

  return (
    <DrawerPrimitive.Label
      class={cn(
        "font-semibold text-lg leading-none tracking-tight",
        local.class,
      )}
      {...rest}
    />
  );
};

export type DrawerDescriptionProps<T extends ValidComponent = "p"> =
  DescriptionProps<T> & {
    class?: string;
  };

export const DrawerDescription = <T extends ValidComponent = "p">(
  props: DynamicProps<T, DrawerDescriptionProps>,
) => {
  const [local, rest] = splitProps(props as DrawerDescriptionProps, ["class"]);

  return (
    <DrawerPrimitive.Description
      class={cn("text-muted-foreground text-sm", local.class)}
      {...rest}
    />
  );
};
