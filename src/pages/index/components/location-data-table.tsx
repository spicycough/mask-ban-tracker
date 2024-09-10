import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/solid-query";
import type { RowData, Table as SolidTable } from "@tanstack/solid-table";
import {
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/solid-table";
import { CrossIcon, PlusIcon } from "lucide-solid";
import { type Accessor, For, Show, createSignal } from "solid-js";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/solid-table";

import type { Location } from "@/db/schema";
import { EditableCell } from "./editable-row";
import {
  SelectedRowsCellCheckbox,
  SelectedRowsHeaderCheckbox,
} from "./select-column-def";

export const columns: ColumnDef<Location>[] = [
  {
    id: "select",
    header: (props) => <SelectedRowsHeaderCheckbox {...props} />,
    cell: (props) => <SelectedRowsCellCheckbox {...props} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export type LocationDataTableProps = {
  columns?: ColumnDef<Location>[];
  data: Accessor<Location[] | undefined>;
};

declare module "@tanstack/solid-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export const LocationDataTable = (props: LocationDataTableProps) => {
  const [data, setData] = createSignal<Location[]>(props.data() ?? []);

  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>(
    {},
  );
  const [rowSelection, setRowSelection] = createSignal({});

  const addPendingRow = () => {
    setData((data) => [...data, { id: "", name: "", status: "" }]);
  };

  const queryClient = useQueryClient();

  // const mutation = createMutation(() => ({
  //   mutationKey: ["map", "locations"],
  //   mutationFn: async (data: NewLocation) => {
  //     const locations = await hc.map.locations.$post({ json: data });
  //     if (!locations.ok) {
  //       const { status, statusText } = locations;
  //       toast.error(`${status} ${statusText}`);
  //     }
  //     return (await locations.json()) as Location[];
  //   },
  //   onSettled: async () => {
  //     return await queryClient.invalidateQueries({
  //       queryKey: ["map", "locations"],
  //     });
  //   },
  // }));

  const table = createSolidTable({
    get data() {
      return data();
    },
    columns,
    defaultColumn: {
      cell: (props) => <EditableCell {...props} />,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      get columnFilters() {
        return columnFilters();
      },
      get columnVisibility() {
        return columnVisibility();
      },
      get rowSelection() {
        return rowSelection();
      },
      get sorting() {
        return sorting();
      },
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((prev) => {
          return prev.map((row, index) => {
            if (index !== rowIndex) {
              return row;
            }
            return {
              ...prev[rowIndex],
              [columnId]: value,
            };
          });
        });
      },
    },
  });

  return (
    <div class="space-y-4">
      <DataTableToolbar table={table} addRow={addPendingRow} />
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <TableRow>
                  <For each={headerGroup.headers}>
                    {(header) => {
                      return (
                        <TableHead>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    }}
                  </For>
                </TableRow>
              )}
            </For>
          </TableHeader>
          <TableBody>
            <Show
              when={table.getRowModel().rows?.length}
              fallback={
                <TableRow>
                  <TableCell colSpan={columns.length} class="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              }
            >
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        <TableCell>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      )}
                    </For>
                  </TableRow>
                )}
              </For>
              {/*
              <Show when={pendingRow()}>
                {(row) => (
                  <TableRow data-state>
                    <For each={Object.entries(row())}>
                      {([id, cell]) => {
                        const getValue = () => {
                          if (id === "id") {
                            return pendingRow()?.id ?? "";
                          }
                          if (id === "name") {
                            return pendingRow()?.name ?? "";
                          }
                          if (id === "status") {
                            return pendingRow()?.status ?? "";
                          }
                          return "";
                        };

                        return (
                          <TableCell>
                              <EditableCell 
                          </TableCell>
                        );
                      }}
                    </For>
                  </TableRow>
                )}
              </Show>
              */}
            </Show>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

interface DataTableToolbarProps<TData> {
  table: SolidTable<TData>;
  addRow: () => void;
}

export function DataTableToolbar(props: DataTableToolbarProps<Location>) {
  const isFiltered = () => props.table.getState().columnFilters.length > 0;

  return (
    <div class="flex items-center justify-between">
      <div class="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter locations..."
          value={
            (props.table.getColumn("name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            props.table.getColumn("name")?.setFilterValue(event.target.value)
          }
          class="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered() && (
          <Button
            variant="ghost"
            onClick={() => props.table.resetColumnFilters()}
            class="h-8 px-2 lg:px-3"
          >
            Reset
            <CrossIcon class="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Button variant="outline" class="h-8 px-2 lg:px-3" onClick={props.addRow}>
        <PlusIcon class="mr-2 h-4 w-4" />
        Add
      </Button>
    </div>
  );
}
