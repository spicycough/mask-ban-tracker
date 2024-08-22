import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-solid";
import { createEffect, createSignal, mergeProps, on } from "solid-js";

type Theme = "light" | "dark" | "system";

const isTheme = (t: string | null): t is Theme => {
  return t === "light" || t === "dark" || t === "system";
};

function getSystemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getCachedTheme() {
  const cachedTheme = localStorage.getItem("theme");
  return isTheme(cachedTheme) ? cachedTheme : undefined;
}

type ThemeToggleProps = {
  defaultTheme?: Theme;
  storageKey?: string;
};

const defaultProps = {
  defaultTheme: "system",
  storageKey: "theme",
} satisfies ThemeToggleProps;

export function ThemeToggle(props: ThemeToggleProps) {
  const mergedProps = mergeProps(props, defaultProps);
  const initialTheme = () => getCachedTheme() || mergedProps.defaultTheme;
  const [theme, setTheme] = createSignal(initialTheme());

  createEffect(
    on(theme, (theme) => {
      localStorage.setItem(mergedProps.storageKey, theme);

      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme === "system" ? getSystemTheme() : theme);
    }),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={Button}
        variant="ghost"
        size="sm"
        class="w-8 px-0"
      >
        <SunIcon class="dark:-rotate-[360deg] size-5 rotate-0 scale-100 transition-transform duration-500 dark:scale-0" />
        <MoonIcon class="absolute size-5 rotate-[360deg] scale-0 transition-transform duration-500 dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setTheme("light")}>
          <SunIcon class="mr-2 size-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme("dark")}>
          <MoonIcon class="mr-2 size-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme("system")}>
          <LaptopIcon class="mr-2 size-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
