import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { hc } from "@/lib/hono";
// import { useQueryClient } from "@tanstack/solid-query";
import type { SortingState, VisibilityState } from "@tanstack/solid-table";
import {
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/solid-table";
import type { InferResponseType } from "hono";
import { For, Show, createEffect, createSignal } from "solid-js";
import { columns } from "./columns";

export type BansDataTableProps = {
  data: InferResponseType<typeof hc.bans.$get>;
};

export const BansDataTable = (props: BansDataTableProps) => {
  const [data, setData] = createSignal(props.data ?? []);

  const [sorting, setSorting] = createSignal<SortingState>([]);
  // const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>(
  //   [],
  // );
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>(
    {},
  );
  const [rowSelection, setRowSelection] = createSignal({});

  const addPendingRow = () => {
    setData((data) => {
      return { ...data, id: "", name: "", status: "" };
    });
  };

  // const queryClient = useQueryClient();

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
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      // get columnFilters() {
      //   return columnFilters();
      // },
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
          </Show>
        </TableBody>
      </Table>
    </div>
  );
};
