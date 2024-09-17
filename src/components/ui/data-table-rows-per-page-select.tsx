import type { SelectRootProps } from "@kobalte/core/select";
import type { Table } from "@tanstack/solid-table";
import { createMemo } from "solid-js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const defaultOptions = [10, 20, 30, 40, 50];

export type RowsPerPageSelectProps<TData> = Partial<
  SelectRootProps<typeof defaultOptions>
> & {
  table: Table<TData>;
};

export const RowsPerPageSelect = <TData,>(
  props: RowsPerPageSelectProps<TData>,
) => {
  const table = createMemo(() => props.table);

  return (
    <Select
      multiple={false}
      options={defaultOptions}
      placeholder={table().getState().pagination.pageSize}
      onChange={(value) => {
        table().setPageSize(Number(value));
      }}
      itemComponent={(props) => (
        <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
      )}
    >
      <SelectTrigger>
        <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
};
