import { createMemo } from "solid-js";
import resolveConfig from "tailwindcss/resolveConfig";

import { default as tailwindConfig } from "../../tailwind.config.js";

export default function useTailwind() {
  const tailwind = createMemo(() => {
    return resolveConfig(tailwindConfig);
  });

  return {
    tailwind,
    get colors() {
      return tailwind().theme.colors;
    },
  };
}
