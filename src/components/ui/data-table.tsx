import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/solid-table";
import { ArrowDownIcon } from "lucide-solid";
import {
  For,
  Index,
  Show,
  createContext,
  createSignal,
  mergeProps,
  splitProps,
  useContext,
} from "solid-js";
import type {
  Accessor,
  ComponentProps,
  ParentProps,
  VoidProps,
} from "solid-js";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/solid-table";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Data = any;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Value = any;

export type DataTableProps<TData extends Data, TValue extends Value> = {
  columns: ColumnDef<TData, TValue>[];
  data: Accessor<TData[] | undefined>;
};

const buildDataTableContext = <TData extends Data, TValue extends Value>(
  initialState: DataTableProps<TData, TValue>,
) => {
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>(
    {},
  );
  const [rowSelection, setRowSelection] = createSignal({});

  const table = createSolidTable({
    get data() {
      return initialState.data() || [];
    },
    columns: initialState.columns,
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
  });

  return {
    // Table
    table,
    get data() {
      return initialState.data();
    },
    get columns() {
      return initialState.columns;
    },
    // Sorting
    sorting,
    setSorting,
    // Column filters
    columnFilters,
    setColumnFilters,
    // Column visibility
    columnVisibility,
    setColumnVisibility,
    // Row selection
    rowSelection,
    setRowSelection,
  };
};

type DataTableContextValue<
  TData extends Data = Data,
  TValue extends Value = Value,
> = ReturnType<typeof buildDataTableContext<TData, TValue>>;

const DataTableContext = createContext<DataTableContextValue>();

const DataTableProvider = <TData extends Data, TValue extends Value>(
  props: ParentProps<DataTableProps<TData, TValue>>,
) => {
  const context = buildDataTableContext<TData, TValue>(props);

  return (
    <DataTableContext.Provider value={context}>
      {props.children}
    </DataTableContext.Provider>
  );
};

export const useDataTable = <TData extends Data, TValue extends Value>() => {
  const table = useContext(DataTableContext);
  if (!table) {
    throw new Error("DataTable must be used within a DataTableProvider");
  }

  return table;
};

export type DataTableHeaderProps<
  TData extends Data,
  TValue extends Value,
> = ComponentProps<typeof TableFooter>;

export const DataTableHeader = <TData extends Data, TValue extends Value>(
  props: DataTableHeaderProps<TData, TValue>,
) => {
  const [local, rest] = splitProps(props, ["class"]);

  const { table } = useDataTable<TData, TValue>();

  return (
    <TableHeader class={cn(local.class)} {...rest}>
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
  );
};

export type DataTableBodyProps<
  TData extends Data,
  TValue extends Value,
> = ComponentProps<typeof TableBody>;

export const DataTableBody = <TData extends Data, TValue extends Value>(
  props: DataTableBodyProps<Data, Value>,
) => {
  const [local, rest] = splitProps(props, ["class"]);

  const { table, columns } = useDataTable<TData, TValue>();

  return (
    <TableBody class={cn(local.class)} {...rest}>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )}
              </For>
            </TableRow>
          )}
        </For>
      </Show>
    </TableBody>
  );
};

export type DataTableFooterProps<
  TData extends Data,
  TValue extends Value,
> = ComponentProps<typeof TableFooter>;

export const DataTableFooter = <TData extends Data, TValue extends Value>(
  props: DataTableFooterProps<TData, TValue>,
) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <TableFooter class={cn(local.class)} {...rest}>
      {props.children}
    </TableFooter>
  );
};

export const DataTable = <TData extends Data, TValue extends Value>(
  props: DataTableProps<TData, TValue> &
    ParentProps<ComponentProps<typeof Table>>,
) => {
  const [local, rest] = splitProps(props as DataTableProps<TData, TValue>, [
    "columns",
    "data",
  ]);

  return (
    <DataTableProvider columns={local.columns} data={local.data} {...rest}>
      <div class="rounded-md border">
        <Table {...rest}>
          {/* <DataTableHeader /> */}
          {/* <DataTableBody /> */}
          {/* <DataTableFooter /> */}
          {props.children}
        </Table>
      </div>
    </DataTableProvider>
  );
};

type ColumnVisibilityFilterProps = ComponentProps<typeof DropdownMenu> &
  ParentProps<{
    class?: string;
    table: ReturnType<typeof createSolidTable>;
    contentProps?: ComponentProps<typeof DropdownMenuContent> & {
      class?: string;
    };
  }>;

export const ColumnVisibilityFilter = (props: ColumnVisibilityFilterProps) => {
  const [local, others, rest] = splitProps(
    props,
    ["class", "children", "table"],
    ["contentProps"],
  );

  const [localContent, restContent] = splitProps(others.contentProps ?? {}, [
    "class",
  ]);

  return (
    <DropdownMenu {...rest}>
      <Show
        when={typeof local.children === "string"}
        fallback={
          <DropdownMenuTrigger as={Button} variant="outline" class="ml-auto">
            {local.children ?? "Columns"}
          </DropdownMenuTrigger>
        }
      >
        {local.children}
      </Show>
      <DropdownMenuContent
        class={cn("max-h-96 overflow-y-auto", localContent.class)}
        {...restContent}
      >
        <For
          each={local.table
            .getAllColumns()
            .filter((column) => column.getCanHide())}
        >
          {(item) => (
            <DropdownMenuCheckboxItem
              class="capitalize"
              checked={item.getIsVisible()}
              onChange={(value) => item.toggleVisibility(!!value)}
            >
              {item.id}
            </DropdownMenuCheckboxItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type RowSelectionFilterProps = ComponentProps<typeof DropdownMenu> &
  ParentProps<{
    class?: string;
    table: ReturnType<typeof createSolidTable>;
  }>;

export const RowSelectionFilter = (props: RowSelectionFilterProps) => {
  const [local, rest] = splitProps(props, ["class", "children", "table"]);

  return (
    <DropdownMenu {...rest}>
      <Show
        when={typeof local.children === "string"}
        fallback={
          <DropdownMenuTrigger as={Button} variant="outline" class="ml-auto">
            {local.children ?? "Columns"}
          </DropdownMenuTrigger>
        }
      >
        {local.children}
      </Show>
      <DropdownMenuContent class={cn("max-h-96 overflow-y-auto")}>
        <For
          each={local.table
            .getAllColumns()
            .filter((column) => column.getCanHide())}
        >
          {(item) => (
            <DropdownMenuCheckboxItem
              class="capitalize"
              checked={item.getIsVisible()}
              onChange={(value) => item.toggleVisibility(!!value)}
            >
              {item.id}
            </DropdownMenuCheckboxItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type SortableHeaderProps = ComponentProps<typeof Button> &
  ParentProps<{
    column: ReturnType<ReturnType<typeof createSolidTable>["getColumn"]>;
    class?: string;
  }>;

export const SortableHeader = (props: SortableHeaderProps) => {
  const [local, rest] = splitProps(props, ["class", "column"]);

  return (
    <Button
      variant="ghost"
      onClick={() =>
        local.column?.toggleSorting(local.column.getIsSorted() === "asc")
      }
      class={cn(local.class)}
      {...rest}
    >
      {props.children ?? "Status"}
      <ArrowDownIcon class="ml-2 h-4 w-4" />
    </Button>
  );
};

type PaginationButtonProps = ParentProps<ComponentProps<typeof Button>>;

const PaginationPreviousButton = (props: PaginationButtonProps) => {
  const [local, rest] = splitProps(props, ["class", "children"]);

  const { table } = useDataTable();

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
      class={cn(local.class)}
      {...rest}
    >
      {local.children ?? "Previous"}
    </Button>
  );
};

const PaginationNextButton = (
  props: ParentProps<ComponentProps<typeof Button>>,
) => {
  const [local, rest] = splitProps(props, ["class", "children"]);

  const { table } = useDataTable();

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
      class={cn(local.class)}
      {...rest}
    >
      {local.children ?? "Previous"}
    </Button>
  );
};

const PaginationPageButtonGroup = (
  props: ParentProps<ComponentProps<typeof Button>>,
) => {
  const [local, rest] = splitProps(props, ["class", "children", "page"]);

  const { table } = useDataTable();

  const pages = () => Array<number>(table.getPageCount()).fill(1);

  return (
    <Index each={pages()}>
      {(page) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => table.setPageIndex(page())}
          class={cn(local.class)}
          {...rest}
        >
          {page() + 1}
        </Button>
      )}
    </Index>
  );
};

type PaginationControlProps = ComponentProps<typeof Button> &
  VoidProps<{
    class?: string;
  }>;

export const PaginationControl = (props: PaginationControlProps) => {
  const [local, rest] = splitProps(
    mergeProps(
      {
        size: "sm",
        variant: "outline",
      } satisfies PaginationControlProps,
      props as PaginationControlProps,
    ),
    ["as", "class", "size", "variant"],
  );

  return (
    <div
      class={cn("flex items-center justify-end space-x-2 py-4", local.class)}
      {...rest}
    >
      <PaginationPreviousButton
        size={local.size}
        variant={local.variant}
        class={local.class}
      >
        Previous
      </PaginationPreviousButton>
      <PaginationPageButtonGroup
        size={local.size}
        variant={local.variant}
        class={local.class}
      />
      <PaginationNextButton
        size={local.size}
        variant={local.variant}
        class={local.class}
      >
        Next
      </PaginationNextButton>
    </div>
  );
};
