import { cn } from "@/lib/utils";
import { createEffect, createSignal, onCleanup } from "solid-js";

export default function ScreenSize() {
  const [dimensions, setDimensions] = createSignal({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const updateDimensions = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  createEffect(() => {
    window.addEventListener("resize", updateDimensions);
    onCleanup(() => window.removeEventListener("resize", updateDimensions));
  });

  return (
    <div
      class={cn(
        "fixed bottom-5 left-5 z-50 flex gap-x-2 px-2.5 py-1",
        "items-center text-center align-middle",
        "rounded-full bg-black font-light font-mono text-white text-xs",
        "animate-out opacity-100 transition-opacity duration-400 hover:opacity-0",
      )}
    >
      <p class="hidden max-xs:block">xs</p>
      <p class="hidden xs:max-sm:block">sm</p>
      <p class="hidden sm:max-md:block">md</p>
      <p class="hidden md:max-lg:block">lg</p>
      <p class="hidden lg:max-xl:block">xl</p>
      <p class="hidden font-mono xl:block">2xl</p>
      <div class="h-4 w-px bg-gray-800" />
      <span class="font-mono">
        {dimensions().width.toLocaleString()} x{" "}
        {dimensions().height.toLocaleString()}
      </span>
    </div>
  );
}
