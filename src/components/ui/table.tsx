import { cn } from "@/lib/utils";
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import { type ComponentProps, splitProps } from "solid-js";
import type { ValidComponent } from "solid-js";

export type TableProps<T extends ValidComponent = "table"> =
  ComponentProps<T> & {
    class?: string;
  };

export const Table = <T extends ValidComponent = "table">(
  props: PolymorphicProps<T, TableProps<T>>,
) => {
  const [local, rest] = splitProps(props as TableProps, ["class"]);

  return (
    <div class="relative w-full overflow-auto">
      <Polymorphic
        as="table"
        class={cn("w-full caption-bottom text-sm", local.class)}
        {...rest}
      />
    </div>
  );
};

export type TableHeaderProps<T extends ValidComponent = "thead"> =
  ComponentProps<T> & {
    class?: string;
  };

export const TableHeader = <T extends ValidComponent = "thead">(
  props: PolymorphicProps<T, TableHeaderProps<T>>,
) => {
  const [local, rest] = splitProps(props as TableHeaderProps, ["class"]);

  return (
    <Polymorphic
      as="thead"
      class={cn("[&_tr]:border-b", local.class)}
      {...rest}
    />
  );
};

export type TableBodyProps<T extends ValidComponent = "tbody"> =
  ComponentProps<T> & {
    class?: string;
  };

export const TableBody = <T extends ValidComponent = "tbody">(
  props: PolymorphicProps<T, TableBodyProps<T>>,
) => {
  const [local, rest] = splitProps(props as TableBodyProps, ["class"]);

  return (
    <Polymorphic
      as="tbody"
      class={cn("[&_tr:last-child]:border-0", local.class)}
      {...rest}
    />
  );
};

export type TableFooterProps<T extends ValidComponent = "tfoot"> =
  ComponentProps<T> & {
    class?: string;
  };

export const TableFooter = <T extends ValidComponent = "tfoot">(
  props: PolymorphicProps<T, TableFooterProps<T>>,
) => {
  const [local, rest] = splitProps(props as TableFooterProps, ["class"]);

  return (
    <Polymorphic
      as="tfoot"
      class={cn("bg-primary font-medium text-primary-foreground", local.class)}
      {...rest}
    />
  );
};

export type TableRowProps<T extends ValidComponent = "tr"> =
  ComponentProps<T> & {
    class?: string;
  };

export const TableRow = <T extends ValidComponent = "tr">(
  props: PolymorphicProps<T, TableRowProps<T>>,
) => {
  const [local, rest] = splitProps(props as TableRowProps, ["class"]);

  return (
    <Polymorphic
      as="tr"
      class={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        local.class,
      )}
      {...rest}
    />
  );
};

export type TableHeadProps<T extends ValidComponent = "th"> =
  ComponentProps<T> & {
    class?: string;
  };

export const TableHead = <T extends ValidComponent = "th">(
  props: PolymorphicProps<T, TableHeadProps<T>>,
) => {
  const [local, rest] = splitProps(props as TableHeadProps, ["class"]);

  return (
    <Polymorphic
      as="th"
      class={cn(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        local.class,
      )}
      {...rest}
    />
  );
};

export type TableCellProps<T extends ValidComponent = "td"> =
  ComponentProps<T> & {
    class?: string;
  };

export const TableCell = <T extends ValidComponent = "td">(
  props: PolymorphicProps<T, TableCellProps<T>>,
) => {
  const [local, rest] = splitProps(props as TableCellProps, ["class"]);

  return (
    <Polymorphic
      as="td"
      class={cn(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        local.class,
      )}
      {...rest}
    />
  );
};

export type TableCaptionProps<T extends ValidComponent = "caption"> =
  ComponentProps<T> & {
    class?: string;
  };

export const TableCaption = <T extends ValidComponent = "caption">(
  props: PolymorphicProps<T, TableCaptionProps<T>>,
) => {
  const [local, rest] = splitProps(props as TableCaptionProps, ["class"]);

  return (
    <Polymorphic
      as="caption"
      class={cn("mt-4 text-muted-foreground text-sm", local.class)}
      {...rest}
    />
  );
};
