// import { useQueryClient } from "@tanstack/solid-query";

import {
  SelectAllCheckbox,
  SelectRowCheckbox,
} from "@/components/ui/data-table-select";
import type { hc } from "@/lib/hono";
import type { ColumnDef } from "@tanstack/solid-table";
import type { InferResponseType } from "hono";
import { BansTableRowActions } from "./bans-table-row-actions";

export const columns: ColumnDef<
  InferResponseType<typeof hc.bans.$get>[number]
>[] = [
  {
    id: "select",
    header: (props) => <SelectAllCheckbox {...props} />,
    cell: (props) => <SelectRowCheckbox {...props} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (columns) => columns.regionName,
    header: "Location",
  },
  {
    accessorFn: (columns) => columns.status,
    header: "Status",
  },
  {
    accessorFn: (columns) => columns.proposedDate,
    header: "Date Proposed",
  },
  {
    id: "actions",
    cell: (cell) => {
      return <BansTableRowActions data={cell.row.original} />;
    },
  },
];
