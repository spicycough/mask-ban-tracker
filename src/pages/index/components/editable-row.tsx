import type { CellContext, RowData } from "@tanstack/solid-table";
import { createEffect, createSignal, on } from "solid-js";

export interface EditableCellProps<TData extends RowData>
  extends CellContext<
    {
      id: string;
      name: string;
      status: string;
    },
    unknown
  > {}

export const EditableCell = (props: EditableCellProps<Location>) => {
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
