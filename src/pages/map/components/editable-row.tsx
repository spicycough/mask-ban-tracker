import type { BanRegion } from "@/db/schema";
import type { CellContext, RowData } from "@tanstack/solid-table";
import { createEffect, createSignal, on } from "solid-js";

export interface EditableCellProps<TData extends RowData>
  extends CellContext<TData, unknown> {}

export const EditableCell = (props: EditableCellProps<BanRegion>) => {
  const [value, setValue] = createSignal(props.getValue());

  createEffect(on(props.getValue, setValue));

  return (
    <input
      value={value() as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        props.table.options.meta?.updateData(
          props.row.index,
          props.column.id,
          value,
        );
      }}
    />
  );
};
