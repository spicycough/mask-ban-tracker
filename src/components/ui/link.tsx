import type { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link as LinkPrimitive } from "@kobalte/core/link";
import { createMemo, splitProps } from "solid-js";
import { usePageContext } from "vike-solid/usePageContext";

import type { LinkRootProps as KobalteLinkRootProps } from "@kobalte/core/link";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import type { VariantProps } from "class-variance-authority";
import type { ValidComponent } from "solid-js";

export type LinkProps<T extends ValidComponent = "a"> =
  KobalteLinkRootProps<T> &
    VariantProps<typeof buttonVariants> & {
      class?: string;
      href: string;
    };

export function Link<T extends ValidComponent = "a">(
  props: PolymorphicProps<T, LinkProps<T>>,
) {
  const [local, rest] = splitProps(props as LinkProps, [
    "href",
    "class",
    "variant",
    "size",
  ]);

  const pageContext = usePageContext();

  const isActive = createMemo(() => {
    const isRoot = local.href === "/";
    if (!isRoot) {
      return pageContext.urlPathname.startsWith(local.href);
    }
    return pageContext.urlPathname === local.href;
  });

  return (
    <LinkPrimitive
      href={local.href}
      class={cn(local.class)}
      data-active={isActive() ? "" : undefined}
      {...rest}
    />
  );
}
