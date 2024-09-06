import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link as LinkPrimitive } from "@kobalte/core/link";
import { createMemo, splitProps } from "solid-js";
import { usePageContext } from "vike-solid/usePageContext";

import type { LinkRootProps } from "@kobalte/core/link";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { VariantProps } from "class-variance-authority";
import type { ValidComponent } from "solid-js";

type linkProps<T extends ValidComponent = "a"> = LinkRootProps<T> &
  VariantProps<typeof buttonVariants> & {
    class?: string;
    href: string;
  };

export function Link<T extends ValidComponent = "a">(
  props: PolymorphicProps<T, linkProps<T>>,
) {
  const [local, rest] = splitProps(props as linkProps, [
    "href",
    "class",
    "variant",
    "size",
  ]);

  const pageContext = usePageContext();

  const isActive = createMemo(() =>
    local.href === "/"
      ? pageContext.urlPathname === local.href
      : pageContext.urlPathname.startsWith(local.href),
  );

  return (
    <LinkPrimitive
      href={local.href}
      class={cn(
        buttonVariants({
          size: local.size,
          variant: local.variant,
        }),
        local.class,
      )}
      data-active={isActive() ? "" : undefined}
      {...rest}
    />
  );
}
