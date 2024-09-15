import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMapContext } from "@/stores/map";
import { splitProps } from "solid-js";

interface ResetViewportButtonProps extends ButtonProps {}

export const ResetViewportButton = (props: ResetViewportButtonProps) => {
  const [local, rest] = splitProps(props as ResetViewportButtonProps, [
    "class",
  ]);

  const { canResetViewport, resetViewport, setIsResettingViewport } =
    useMapContext();

  return (
    <div
      data-visible={canResetViewport()}
      class={cn(
        "fixed bottom-0 flex w-full items-center justify-center",
        // Animation
        "animate-in transition-transform",
        // Translate from bottom of screen up on viewport
        "translate-y-full data-[visible=true]:translate-y-0",
      )}
    >
      <div class="rounded-t-xl bg-card-foreground">
        <Button
          type="button"
          variant="link"
          class={cn("text-base text-primary-foreground", local.class)}
          onClick={() => {
            resetViewport();
            setIsResettingViewport(true);
          }}
          {...rest}
        >
          Reset view
        </Button>
      </div>
    </div>
  );
};
