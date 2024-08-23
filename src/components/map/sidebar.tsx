import { Button, buttonVariants } from "@/components/ui/button";
import {
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ContextValue } from "@corvu/resizable";
import { type ParentProps, createSignal } from "solid-js";
import { For, type JSX, Show } from "solid-js";

export const Sidebar = (props: ParentProps) => {
  const [sizes, setSizes] = createSignal([]);
  const [isCollapsed, setIsCollapsed] = createSignal(true);
  const [resizableContext, setResizableContext] =
    createSignal<ContextValue | null>(null);

  return (
    <div class="hidden md:block">
      <Resizable
        class="border-r bg-background"
        sizes={sizes()}
        onSizesChange={setSizes}
      >
        <ResizablePanel
          // initialSize={0.2}
          // initialSize={sizes()[0] ?? 0.2}
          minSize={0.2}
          // maxSize={0.3}
          // collapsible
          // onCollapse={(e) => setIsCollapsed(e === 0)}
          // onExpand={() => setIsCollapsed(false)}
          // class={cn(
          //   isCollapsed() &&
          //     "min-w-[50px] transition-all duration-300 ease-in-out",
          // )}
        >
          <Separator />
          <div class="container flex flex-col items-center gap-10 py-10">
            <h1 class="font-semibold text-2xl">Mask Bans</h1>
            <div class="grid">
              <Button variant="outline">Nassau County</Button>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>{props.children}</ResizablePanel>
      </Resizable>
    </div>
  );
};

type Props = {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: JSX.Element;
    variant: "default" | "ghost";
  }[];
};

export const Nav = (props: Props) => {
  return (
    <div
      data-collapsed={props.isCollapsed}
      class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav class="grid gap-1 px-2 group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-2">
        <For each={props.links}>
          {(item) => (
            <Show
              when={props.isCollapsed}
              fallback={
                <a
                  // biome-ignore lint/a11y/useValidAnchor: <explanation>
                  href="#"
                  class={cn(
                    buttonVariants({
                      variant: item.variant,
                      size: "sm",
                      class: "text-sm",
                    }),
                    item.variant === "default" &&
                      "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                    "justify-start",
                  )}
                >
                  <div class="mr-2">{item.icon}</div>
                  {item.title}
                  {item.label && (
                    <span
                      class={cn(
                        "ml-auto",
                        item.variant === "default" &&
                          "text-background dark:text-white",
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </a>
              }
            >
              <Tooltip openDelay={0} closeDelay={0} placement="right">
                <TooltipTrigger
                  as="a"
                  href="#"
                  class={cn(
                    buttonVariants({ variant: item.variant, size: "icon" }),
                    "h-9 w-9",
                    item.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                  )}
                >
                  {item.icon}
                  <span class="sr-only">{item.title}</span>
                </TooltipTrigger>
                <TooltipContent class="flex items-center gap-4">
                  {item.title}
                  <Show when={item.label}>
                    <span class="ml-auto text-muted-foreground">
                      {item.label}
                    </span>
                  </Show>
                </TooltipContent>
              </Tooltip>
            </Show>
          )}
        </For>
      </nav>
    </div>
  );
};
