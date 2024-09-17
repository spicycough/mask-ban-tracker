import {
  PaginationFirstPageButton,
  PaginationLastPageButton,
  PaginationNextPageButton,
  PaginationPrevPageButton,
} from "@/components/ui/data-table-pagination";
import { DataTableSummaryText } from "@/components/ui/data-table-summary-text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TextField, TextFieldRoot } from "@/components/ui/textfield";
import type { hc } from "@/lib/hono";
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
import { For, Show, createSignal } from "solid-js";
import { columns } from "./columns";

export type BansDataTableProps = {
  data: InferResponseType<typeof hc.bans.$get>;
};

export const BansDataTable = (props: BansDataTableProps) => {
  const [data, setData] = createSignal(props.data ?? []);

  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>(
    {},
  );
  const [rowSelection, setRowSelection] = createSignal({});

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
  });

  return (
    <div class="flex flex-col gap-2">
      <div class="flex items-center py-4">
        <TextFieldRoot>
          <TextField
            type="text"
            class="h-8"
            placeholder="Filter locations..."
            value={
              (table.getColumn("regionName")?.getFilterValue() as string) ?? ""
            }
            onInput={(e) =>
              table
                .getColumn("regionName")
                ?.setFilterValue(e.currentTarget.value)
            }
          />
        </TextFieldRoot>
      </div>
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
      <div class="flex items-center justify-between p-2">
        <DataTableSummaryText table={table} />
        <div class="flex items-center space-x-2">
          <PaginationFirstPageButton table={table} />
          <PaginationPrevPageButton table={table} />
          <PaginationNextPageButton table={table} />
          <PaginationLastPageButton table={table} />
        </div>
      </div>
    </div>
  );
};
