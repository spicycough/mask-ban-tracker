import { cn } from "@/lib/utils";
import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import type { Table } from "@tanstack/solid-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-solid";
import type { ComponentProps, ValidComponent } from "solid-js";
import { createMemo, splitProps } from "solid-js";
import { Button, type ButtonProps } from "./button";

export type PaginationButtonProps<
  TData,
  T extends ValidComponent = "button",
> = ButtonProps<T> & {
  table: Table<TData>;
};

export const PaginationFirstPageButton = <
  TData,
  T extends ValidComponent = "button",
>(
  props: PaginationButtonProps<TData, T>,
) => {
  const [local, rest] = splitProps(props as PaginationButtonProps<TData>, [
    "class",
    "table",
  ]);

  const table = createMemo(() => local.table);

  return (
    <Button
      variant="outline"
      class={cn("hidden h-8 w-8 p-0 lg:flex", local.class)}
      onClick={() => table().setPageIndex(0)}
      disabled={!table().getCanPreviousPage()}
      {...rest}
    >
      <span class="sr-only">Go to first page</span>
      <ChevronsLeftIcon class="h-4 w-4" />
    </Button>
  );
};

export const PaginationLastPageButton = <
  TData,
  T extends ValidComponent = "button",
>(
  props: PaginationButtonProps<TData, T>,
) => {
  const [local, rest] = splitProps(props as PaginationButtonProps<TData>, [
    "class",
    "table",
  ]);

  const table = createMemo(() => local.table);

  return (
    <Button
      variant="outline"
      class={cn("hidden h-8 w-8 p-0 lg:flex", local.class)}
      onClick={() => table().setPageIndex(table().getPageCount() - 1)}
      disabled={!table().getCanNextPage()}
      {...rest}
    >
      <span class="sr-only">Go to last page</span>
      <ChevronsRightIcon class="h-4 w-4" />
    </Button>
  );
};

export const PaginationPrevPageButton = <
  TData,
  T extends ValidComponent = "button",
>(
  props: PaginationButtonProps<TData, T>,
) => {
  const [local, rest] = splitProps(props as PaginationButtonProps<TData>, [
    "class",
    "table",
  ]);

  const table = createMemo(() => local.table);

  return (
    <Button
      variant="outline"
      class={cn("h-8 w-8 p-0", local.class)}
      onClick={() => table().previousPage()}
      disabled={!table().getCanPreviousPage()}
      {...rest}
    >
      <span class="sr-only">Go to previous page</span>
      <ChevronLeftIcon class="h-4 w-4" />
    </Button>
  );
};

export const PaginationNextPageButton = <
  TData,
  T extends ValidComponent = "button",
>(
  props: PaginationButtonProps<TData, T>,
) => {
  const [local, rest] = splitProps(props as PaginationButtonProps<TData>, [
    "class",
    "table",
  ]);

  const table = createMemo(() => local.table);

  return (
    <Button
      variant="outline"
      class={cn("h-8 w-8 p-0", local.class)}
      onClick={() => table().nextPage()}
      disabled={!table().getCanNextPage()}
      {...rest}
    >
      <span class="sr-only">Go to next page</span>
      <ChevronRightIcon class="h-4 w-4" />
    </Button>
  );
};

export type PaginationPageButtonProps<
  TData,
  T extends ValidComponent = "button",
> = PaginationButtonProps<TData, T> & {
  page: number;
};

export const PaginationPageButton = <
  TData,
  T extends ValidComponent = "button",
>(
  props: PaginationButtonProps<TData, T>,
) => {
  const [local, rest] = splitProps(props as PaginationPageButtonProps<TData>, [
    "class",
    "table",
    "page",
  ]);

  const table = createMemo(() => local.table);

  return (
    <Button
      variant="outline"
      class={cn("h-8 w-8 p-0", local.class)}
      onClick={() => table().setPageIndex(local.page)}
      {...rest}
    >
      {local.page + 1}
    </Button>
  );
};

export type PaginationControlProps<T extends ValidComponent = "div"> =
  ComponentProps<T>;

export const PaginationControl = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, PaginationControlProps<T>>,
) => {
  const [local, rest] = splitProps(props as PaginationControlProps, ["class"]);

  return (
    <Polymorphic
      as="div"
      class={cn("flex items-center justify-end space-x-2 py-4", local.class)}
      {...rest}
    />
  );
};
