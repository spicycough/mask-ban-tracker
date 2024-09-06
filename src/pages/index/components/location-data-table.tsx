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
import { hc } from "@/lib/hono";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import type { RowData, Table as SolidTable } from "@tanstack/solid-table";
import {
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/solid-table";
import { CrossIcon, PlusIcon, PlusSquareIcon } from "lucide-solid";
import {
  type Accessor,
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  on,
} from "solid-js";
import { toast } from "solid-sonner";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/solid-table";

import type { Location, NewLocation } from "@/db/schema";

export const columns: ColumnDef<Location>[] = [
  {
    accessorKey: "id",
    header: "Id",
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

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Location>> = {
  cell: (props) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = createSignal(props.getValue());

    // If the initialValue is changed external, sync it up with our state
    createEffect(
      on(
        () => props.getValue(),
        (value) => {
          setValue(value);
        },
      ),
    );

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
  },
};

export const LocationDataTable = (props: LocationDataTableProps) => {
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>(
    {},
  );
  const [rowSelection, setRowSelection] = createSignal({});
  const [pendingRow, setPendingRow] = createSignal<Location>();

  const queryClient = useQueryClient();

  const mutation = createMutation(() => ({
    mutationKey: ["map", "locations"],
    mutationFn: async (data: NewLocation) => {
      const locations = await hc.map.locations.$post({ json: data });
      if (!locations.ok) {
        const { status, statusText } = locations;
        toast.error(`${status} ${statusText}`);
      }
      return (await locations.json()) as Location[];
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["map", "locations"],
      });
    },
  }));

  const table = createSolidTable({
    get data() {
      return props.data() ?? [];
    },
    columns,
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
    // meta: {
    //   updateData: (rowIndex, _, value) => {
    //     // const previousTodo = queryClient.getQueryData(['todos', newTodo.id])
    //     if (rowIndex === data().length - 1) {
    //       setNewLocationRow((old) => {
    //         return {
    //           ...old,
    //           value,
    //         };
    //       });
    //     }
    //   },
    // },
  });

  return (
    <div class="space-y-4">
      <DataTableToolbar table={table} />
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
              <Show when={pendingRow()}>
                {(row) => (
                  <TableRow data-state>
                    <For
                      each={table.getCoreRowModel().rows[0].getVisibleCells()}
                    >
                      {(cell) => (
                        <TableCell>
                          <Input
                            value={cell.getValue() as string}
                            onChange={(event) => {
                              setPendingRow((prev) => ({
                                ...prev,
                                ...event.target.value,
                              }));
                            }}
                            class="h-8 w-[150px] lg:w-[250px]"
                          />
                        </TableCell>
                      )}
                    </For>
                  </TableRow>
                )}
              </Show>
            </Show>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

interface DataTableToolbarProps<TData> {
  table: SolidTable<TData>;
}

export function DataTableToolbar<TData>(props: DataTableToolbarProps<TData>) {
  const isFiltered = () => props.table.getState().columnFilters.length > 0;

  return (
    <div class="flex items-center justify-between">
      <div class="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
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
      <Button variant="outline" class="h-8 px-2 lg:px-3">
        <PlusIcon class="mr-2 h-4 w-4" />
        Add
      </Button>
    </div>
  );
}
