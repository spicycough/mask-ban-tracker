import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Route, routes } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { For, Show, type VoidProps, createMemo } from "solid-js";
import { type ComponentProps, type ValidComponent, splitProps } from "solid-js";
import { toast } from "solid-sonner";

export type VerticalNavProps<T extends ValidComponent = "nav"> =
  ComponentProps<T>;

interface NavLink {
  name: string;
  href: Route;
  visible: boolean;
}

export default function VerticalNav(props: VoidProps<VerticalNavProps>) {
  const navLinks = createMemo<NavLink[]>(() => [
    {
      name: "Home",
      href: routes.Home,
      visible: true,
    },
    {
      name: "About",
      href: routes.About,
      visible: true,
    },
  ]);

  const [local, rest] = splitProps(props as VerticalNavProps, ["class"]);

  return (
    <nav
      class={cn(
        "flex h-20 items-center justify-between gap-x-5 px-8",
        local.class,
      )}
      {...rest}
    >
      <a class="flex items-center gap-x-2" href={routes.Home}>
        <span>Solid Launch</span>
      </a>

      <ul class="flex items-center gap-x-5">
        <For each={navLinks()}>
          {({ name, href, visible }) => (
            <Show when={visible}>
              <li>
                <a href={href}>{name}</a>
              </li>
            </Show>
          )}
        </For>

        <li>
          <a href={routes.SignIn}>Sign In</a>
        </li>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div
              class="h-12 w-12 flex-shrink-0 rounded-full"
              style={{
                "background-position": "center",
                "background-size": "cover",
                "background-image":
                  "url(https://thicc-uwu.mywaifulist.moe/waifus/satoru-gojo-sorcery-fight/bOnNB0cwHheCCRGzjHLSolqabo41HxX9Wv33kfW7.jpg?class=thumbnail)",
              }}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItemLabel>My Account</DropdownMenuItemLabel>
            <DropdownMenuItem as="a" href={routes.Dashboard}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                toast.success("Logged out!");
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ul>
    </nav>
  );
}
