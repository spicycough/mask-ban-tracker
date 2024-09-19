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
        <ul
          class="group flex items-center gap-x-1 px-1 py-1"
          style={{ filter: "url(#goo)" }}
        >
          <For each={links}>
            {(link) => (
              <li>
                <Link
                  href={link.href}
                  class={cn(
                    "peer",
                    // Common
                    "inline-flex h-10 w-20 items-center justify-center whitespace-nowrap rounded-full px-4 py-2 ring-offset-background transition-colors",
                    // Text
                    "font-semibold text-base",
                    // Disabled
                    "disabled:pointer-events-none disabled:opacity-50",
                    // Focus-visible
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    // Inactive
                    "text-lime-950 hover:bg-accent hover:text-accent-foreground",
                    // Active
                    "data-[active]:bg-lime-400/50 data-[active]:text-lime-950",
                    // Peer
                    "group-hover:data-[active]:bg-lime-400/35",
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

export const GooeySvg = () => {
  return (
    <svg aria-hidden="true">
      <defs>
        <filter id="goo">
          <feGaussianBlur
            id="blur"
            result="blur"
            in="SourceGraphic"
            stdDeviation="20"
          />
          <feColorMatrix
            id="matrix"
            result="matrix"
            in="blur"
            values="
        1 0 0 0 0                                      
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 15 -10"
            type="matrix"
          />
          <feComposite id="comp" result="comp" in="matrix" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};
