import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DropdownMenuTriggerProps } from "@kobalte/core/dropdown-menu";
import type { Column } from "@tanstack/solid-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDown,
  EyeOffIcon,
} from "lucide-solid";
import type { VoidProps } from "solid-js";
import { Match, Show, Switch, splitProps } from "solid-js";

export const DataTableColumnHeader = <TData, TValue>(
  props: VoidProps<{ column: Column<TData, TValue>; title: string }>,
) => {
  const [local, rest] = splitProps(props, ["column", "title"]);

  return (
    <Show
      when={local.column.getCanSort() && local.column.getCanHide()}
      fallback={<span class="font-medium text-sm">{local.title}</span>}
    >
      <div class="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            as={(props: DropdownMenuTriggerProps) => (
              <Button
                aria-label={
                  local.column.getIsSorted() === "desc"
                    ? "Sorted descending. Click to sort ascending."
                    : local.column.getIsSorted() === "asc"
                      ? "Sorted ascending. Click to sort descending."
                      : "Not sorted. Click to sort ascending."
                }
                variant="ghost"
                class="-ml-4 h-8 data-[expanded]:bg-accent"
                {...rest}
              >
                <span>{local.title}</span>
                <div class="ml-1">
                  <Switch
                    fallback={
                      <ChevronsUpDown aria-hidden="true" class="size-3.5" />
                    }
                  >
                    <Match when={local.column.getIsSorted() === "asc"}>
                      <ArrowUpIcon aria-hidden="true" class="size-3.5" />
                    </Match>
                    <Match when={local.column.getIsSorted() === "desc"}>
                      <ArrowDownIcon aria-hidden="true" class="size-3.5" />
                    </Match>
                  </Switch>
                </div>
              </Button>
            )}
          />
          <DropdownMenuContent>
            <Show when={local.column.getCanSort()}>
              <DropdownMenuItem
                aria-label="Sort ascending"
                onClick={() => local.column.toggleSorting(false, true)}
              >
                <ArrowUpIcon
                  class="mr-2 size-4 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Asc
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="Sort descending"
                onClick={() => local.column.toggleSorting(true, true)}
              >
                <ArrowDownIcon
                  class="mr-2 size-4 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Desc
              </DropdownMenuItem>
            </Show>

            <Show when={local.column.getCanSort() && local.column.getCanHide()}>
              <DropdownMenuSeparator />
            </Show>

            <Show when={local.column.getCanHide()}>
              <DropdownMenuItem
                aria-label="Hide column"
                onClick={() => local.column.toggleVisibility(false)}
              >
                <EyeOffIcon
                  class="mr-2 size-4 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Hide
              </DropdownMenuItem>
            </Show>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Show>
  );
};
