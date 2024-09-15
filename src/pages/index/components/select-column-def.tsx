import { Checkbox, CheckboxControl } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type {
  CellContext,
  HeaderContext,
  Table as SolidTable,
} from "@tanstack/solid-table";
import { type ComponentProps, splitProps } from "solid-js";

export const SelectedRowsHeaderCheckbox = <TData, TValue>(
  props: HeaderContext<TData, TValue>,
) => {
  return (
    <Checkbox
      indeterminate={props.table.getIsSomePageRowsSelected()}
      checked={props.table.getIsAllPageRowsSelected()}
      onChange={(value) => props.table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    >
      <CheckboxControl />
    </Checkbox>
  );
};

export const SelectedRowsCellCheckbox = <TData, TValue>(
  props: CellContext<TData, TValue>,
) => {
  return (
    <Checkbox
      checked={props.row.getIsSelected()}
      onChange={(value) => props.row.toggleSelected(!!value)}
      aria-label="Select row"
    >
      <CheckboxControl />
    </Checkbox>
  );
};

export const SelectedRowsText = <TData,>(
  props: ComponentProps<"div"> & {
    class?: string;
    table: SolidTable<TData>;
  },
) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <div
      class={cn("flex-1 text-muted-foreground text-sm", local.class)}
      {...rest}
    >
      {props.table.getFilteredSelectedRowModel().rows.length} of{" "}
      {props.table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
  );
};
