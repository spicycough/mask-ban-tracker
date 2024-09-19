import { cn } from "@/lib/utils";
import {
  type ComponentProps,
  For,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
} from "solid-js";
import { Link } from "./ui/link";

interface FloatingNavbarProps extends ComponentProps<"div"> {
  links?: {
    href: string;
    label: string;
    default?: boolean;
  };
}

export const FloatingNavbar = (props: FloatingNavbarProps) => {
  const [local, rest] = splitProps(props as FloatingNavbarProps, ["class"]);

  const [expand, setExpand] = createSignal(false);

  onMount(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setExpand(scrollPosition > windowHeight);
    };

    window.addEventListener("scroll", handleScroll);
    onCleanup(() => window.removeEventListener("scroll", handleScroll));
  });

  const links = [
    { href: "/news", label: "News" },
    { href: "/map", label: "Map" },
    { href: "/info", label: "Info" },
  ];

  return (
    <div
      class={cn(
        "-translate-x-1/2 fixed top-4 left-1/2 z-50 transform rounded-full bg-white shadow-md transition-all duration-1000 ease-custom",
        local.class,
      )}
      style={{
        display: "grid",
        "grid-template-columns": `auto ${expand() ? "240px" : "0px"} auto`,
        "--custom": "cubic-bezier(0.76, 0, 0.24, 1)",
      }}
      {...rest}
    >
      <nav>
        <ul class="flex items-center space-x-1 px-1 py-1">
          <For each={links}>
            {(link) => (
              <li>
                <Link
                  href={link.href}
                  class={cn(
                    "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 font-medium text-sm ring-offset-background transition-colors",
                    // Disabled
                    "disabled:pointer-events-none disabled:opacity-50",
                    // Focus-visible
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    // Inactive
                    "hover:bg-accent hover:text-accent-foreground",
                    // Active
                    "data-[active]:bg-primary data-[active]:text-primary-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )}
          </For>
        </ul>
      </nav>
    </div>
  );
};
