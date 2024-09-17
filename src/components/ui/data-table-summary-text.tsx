import { cn } from "@/lib/utils";
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import type { Table } from "@tanstack/solid-table";
import type { ComponentProps, ValidComponent } from "solid-js";
import { createMemo, splitProps } from "solid-js";

export type DataTableSummaryText<
  TData,
  T extends ValidComponent = "button",
> = ComponentProps<T> & {
  table: Table<TData>;
  class?: string;
};

export const DataTableSummaryText = <TData, T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DataTableSummaryText<TData, T>>,
) => {
  const [local, rest] = splitProps(props as DataTableSummaryText<TData, T>, [
    "class",
  ]);

  const table = createMemo(() => props.table);

  return (
    <Polymorphic
      as="div"
      class={cn("flex-1 text-muted-foreground text-sm", local.class)}
      {...rest}
    >
      {table().getFilteredSelectedRowModel().rows.length} of{" "}
      {table().getFilteredRowModel().rows.length} row(s) selected.
    </Polymorphic>
  );
};
