import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { useBanData } from "@/hooks/useBanData";
import { cn } from "@/lib/utils";
import { useMapContext } from "@/stores/map";
import { ArrowRightIcon, CalendarFoldIcon, CoinsIcon } from "lucide-solid";
import { type ComponentProps, Show, createMemo, splitProps } from "solid-js";

export interface HudCardProps extends ComponentProps<typeof Card> {
  class?: string;
}

export const HudCard = (props: HudCardProps) => {
  const [, rest] = splitProps(props, ["class"]);

  const { currentLocation } = useMapContext();
  const { getBanDataByLocation } = useBanData();

  const banData = createMemo(() => {
    const name = currentLocation()?.name;
    if (!name) {
      return null;
    }
    return getBanDataByLocation(name).laws.slice(-1)[0];
  });
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const parsePenalty = (penalty: any) => {
    if (penalty === null) {
      return {
        prison: [],
        fine: 0,
      };
    }

    return {
      prison:
        penalty?.prison && `${penalty.prison.min}-${penalty.prison.max} months`,
      fine: penalty?.fine && `$${penalty?.fine}`,
    };
  };

  return (
    <Show when={currentLocation()}>
      {(location) => {
        console.log("SHOWING");
        return (
          <Card
            class={cn(
              "flex h-full w-[540px] flex-col justify-between gap-y-4 border-border shadow-lg",
              "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
              "transition-opacity ease-in data-[arrived=true]:opacity-85",
              "*:px-4",
              props.class,
            )}
            {...rest}
          >
            <CardHeader class="flex-row items-center justify-between space-y-0 border-muted-foreground border-b pt-4 pb-0">
              <div class="flex flex-col">
                <CardSubtitle class="font-semibold text-muted-foreground text-xl uppercase">
                  US State
                </CardSubtitle>
                <CardTitle class="pb-4 font-bold text-3xl">
                  {location().name}
                </CardTitle>
              </div>
              <Badge class="h-min p-2" variant="destructive">
                <h3 class="text-lg">{banData()?.status}</h3>
              </Badge>
            </CardHeader>
            <CardContent class="py-0">
              <div class="space-y-1 text-lg">
                <div class="flex justify-between tracking-tight">
                  <span class="">{banData()?.description?.toString()}</span>
                </div>
                <div class="flex w-fit flex-col space-y-1">
                  <span class="font-semibold text-xl">Penalty</span>
                  <span class="inline-flex items-center px-1 font-medium tracking-tight">
                    <CalendarFoldIcon class="mr-2 size-5" />
                    {parsePenalty(banData()?.penalty).prison}
                  </span>
                  <span class="inline-flex items-center px-1 font-medium">
                    <CoinsIcon class="mr-2 size-5" />
                    {parsePenalty(banData()?.penalty).fine}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter class="flex justify-end px-4 pt-0 pb-4">
              <Link
                class="justify-end"
                href={`https://thesicktimes.org/mask-bans-and-proposed-bans-by-state/#${location().name}`}
              >
                More Info
                <ArrowRightIcon class="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        );
      }}
    </Show>
  );
};
