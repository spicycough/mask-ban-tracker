import { Checkbox, CheckboxControl } from "@/components/ui/checkbox";
import type { CellContext, HeaderContext } from "@tanstack/solid-table";
import { type ComponentProps, splitProps } from "solid-js";

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
      <CheckboxControl indeterminate={props.table.getIsSomeRowsSelected()} />
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
