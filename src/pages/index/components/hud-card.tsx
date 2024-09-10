import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSubTitle,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useMapContext } from "@/stores/map";
import { ArrowRightIcon } from "lucide-solid";
import { type ComponentProps, Show, splitProps } from "solid-js";

export interface HudCardProps extends ComponentProps<typeof Card> {
  class?: string;
}

export const HudCard = (props: HudCardProps) => {
  const [, rest] = splitProps(props, ["class"]);

  const { currentLocation } = useMapContext();

  return (
    <Show when={currentLocation()}>
      {(location) => {
        return (
          <Card
            class={cn(
              "flex h-full w-72 flex-col justify-between gap-y-4 border-2 border-black opacity-0 shadow-lg backdrop-blur-sm",
              "transition-opacity ease-in data-[arrived=true]:opacity-85",
              "*:px-4",
              props.class,
            )}
            {...rest}
          >
            <CardHeader class="space-y-0 pt-4 pb-0">
              <CardSubTitle class="font-semibold text-muted-foreground text-xl uppercase">
                New York
              </CardSubTitle>
              <CardTitle class="pb-4 font-bold text-3xl">
                {location.name}
              </CardTitle>
              <Separator class="bg-card" />
            </CardHeader>
            <CardContent class="py-0">
              <div class="space-y-1 text-lg">
                <div class="flex justify-between">
                  <span class="font-semibold">Population</span>
                  <span class="">???</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-semibold">Status</span>
                  <span class="">Banned</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-semibold">Punishment</span>
                  <span class="">$1,000</span>
                </div>
              </div>
            </CardContent>
            <CardFooter class="flex justify-end px-4 pt-0 pb-4">
              <Button
                variant="ghost"
                class="justify-end text-white hover:bg-white/20 hover:text-white"
              >
                More Info
                <ArrowRightIcon class="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
      }}
    </Show>
  );
};
