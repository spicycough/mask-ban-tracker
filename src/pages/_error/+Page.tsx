import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-solid";
import { Show } from "solid-js";
import { usePageContext } from "vike-solid/usePageContext";

export default function Page() {
  const { is404 } = usePageContext();

  return (
    <div class="flex h-full flex-col items-center justify-center space-y-6 p-4 text-center">
      <Show
        when={is404}
        fallback={<Status header="500" content="Something went wrong. Boop" />}
      >
        <Status
          header="404"
          subheader="Page not found"
          content="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
        />
      </Show>
      <Button as="a" href="/" variant="default" class="mt-4">
        <ArrowLeftIcon class="mr-2 h-4 w-4" />
        Go to home
      </Button>
    </div>
  );
}

type StatusProps = {
  header: string;
  subheader?: string;
  content: string;
};

const Status = (props: StatusProps) => {
  const { data } = usePageContext();

  return (
    <>
      <h1 class="font-bold text-4xl sm:text-6xl">{props.header}</h1>
      <p class="text-xl sm:text-2xl">{props.subheader}</p>
      <p class="mx-auto max-w-md text-muted-foreground">{props.content}</p>
      <Show when={data}>
        <p class="mx-auto max-w-md text-muted-foreground">{`${data}`}</p>
      </Show>
    </>
  );
};
