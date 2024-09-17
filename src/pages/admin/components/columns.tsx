// import { useQueryClient } from "@tanstack/solid-query";

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  SelectAllCheckbox,
  SelectRowCheckbox,
} from "@/components/ui/data-table-select";
import { BanStatusType } from "@/db/schema";
import type { hc } from "@/lib/hono";
import type { ColumnDef } from "@tanstack/solid-table";
import type { InferResponseType } from "hono";
import {
  CalendarClockIcon,
  LucideMessageCircleQuestion,
  MessageCircleWarningIcon,
  PartyPopperIcon,
  StampIcon,
} from "lucide-solid";
import { match } from "ts-pattern";
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
    id: "regionName",
    accessorFn: (columns) => columns.regionName,
    header: (props) => (
      <DataTableColumnHeader column={props.column} title="Location" />
    ),
  },
  {
    id: "status",
    accessorFn: (columns) => columns.status,
    header: (props) => (
      <DataTableColumnHeader column={props.column} title="Status" />
    ),
    cell: (props) => {
      return match(props.cell.getValue())
        .with(BanStatusType.ENACTED, () => (
          <span class="flex">
            <StampIcon class="mr-2 h-4 w-4" />
            Enacted
          </span>
        ))
        .with(BanStatusType.PROPOSED, () => (
          <span class="flex">
            <MessageCircleWarningIcon class="mr-2 h-4 w-4" />
            Proposed
          </span>
        ))
        .with(BanStatusType.EFFECTIVE, () => (
          <span class="flex">
            <CalendarClockIcon class="mr-2 h-4 w-4" />
            In effect
          </span>
        ))
        .with(BanStatusType.REPEALED, () => (
          <span class="flex">
            <PartyPopperIcon class="mr-2 h-4 w-4" />
            Repealed
          </span>
        ))
        .otherwise(() => (
          <span>
            <LucideMessageCircleQuestion class="mr-2 h-4 w-4" />
            N/A
          </span>
        ));
    },
  },
  {
    id: "proposedDate",
    accessorFn: (columns) => columns.proposedDate,
    header: (props) => (
      <DataTableColumnHeader column={props.column} title="Date Proposed" />
    ),
  },
  {
    id: "actions",
    size: 5,
    cell: (cell) => {
      return <BansTableRowActions data={cell.row.original} />;
    },
  },
];
