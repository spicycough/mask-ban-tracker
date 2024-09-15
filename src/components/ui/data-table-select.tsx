import { Checkbox, CheckboxControl } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import type { CellContext, HeaderContext } from "@tanstack/solid-table";
import { type ComponentProps, type ValidComponent, splitProps } from "solid-js";
import { useDataTable } from "./data-table";

export type SelectAllCheckboxProps<TData, TValue> = HeaderContext<
  TData,
  TValue
> &
  ComponentProps<typeof Checkbox> & {
    class?: string;
  };

export const SelectAllCheckbox = <TData, TValue>(
  props: SelectAllCheckboxProps<TData, TValue>,
) => {
  const [local, rest] = splitProps(
    props as SelectAllCheckboxProps<TData, TValue>,
    ["class"],
  );

  return (
    <Checkbox
      class={local.class}
      indeterminate={props.table.getIsSomePageRowsSelected()}
      checked={props.table.getIsAllPageRowsSelected()}
      onChange={(value) => props.table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      {...rest}
    >
      <CheckboxControl />
    </Checkbox>
  );
};

export type SelectRowCheckboxProps<TData, TValue> = CellContext<TData, TValue> &
  ComponentProps<typeof Checkbox> & {
    class?: string;
  };

export const SelectRowCheckbox = <TData, TValue>(
  props: SelectRowCheckboxProps<TData, TValue>,
) => {
  const [local, rest] = splitProps(
    props as SelectRowCheckboxProps<TData, TValue>,
    ["class"],
  );

  return (
    <Checkbox
      class={local.class}
      checked={props.row.getIsSelected()}
      onChange={(value) => props.row.toggleSelected(!!value)}
      aria-label="Select row"
      {...rest}
    >
      <CheckboxControl />
    </Checkbox>
  );
};

type SelectSummaryProps<T extends ValidComponent = "div"> =
  ComponentProps<T> & {
    class?: string;
  };

export const SelectSummaryText = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, SelectSummaryProps<T>>,
) => {
  const [local, rest] = splitProps(props, ["class"]);

  const { table } = useDataTable();

  return (
    <Polymorphic
      as="div"
      class={cn("flex-1 text-muted-foreground text-sm", local.class)}
      {...rest}
    >
      {table.getFilteredSelectedRowModel().rows.length} of{" "}
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </Polymorphic>
  );
};
