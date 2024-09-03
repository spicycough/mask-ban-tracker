import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { type ComponentProps, splitProps } from "solid-js";

interface NavProps extends ComponentProps<"nav"> {
  class?: string;
}

export const Nav = (props: NavProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <nav class={cn(local.class)} {...rest}>
      <div class="container mx-auto px-6 py-3">
        <div class="flex items-center justify-between">
          <div>
            <a
              class="font-bold text-gray-800 text-xl hover:text-gray-700 md:text-2xl dark:text-white dark:hover:text-gray-300"
              href="/"
            >
              Quickstart
            </a>
          </div>
          <div class="-mx-2 flex items-center">
            <a
              class="mx-2 text-gray-800 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
              href="/about"
            >
              About
            </a>
            <a
              class="mx-2 text-gray-800 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
              href="/contact"
            >
              Contact
            </a>
            <a
              class="mx-2 text-gray-800 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
              href="/subscribe"
            >
              Subscribe
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
