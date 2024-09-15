import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { hc } from "@/lib/hono";
import type {
  DropdownMenuTriggerOptions,
  DropdownMenuTriggerRenderProps,
} from "@kobalte/core/dropdown-menu";
import type { PolymorphicCallbackProps } from "@kobalte/core/polymorphic";
import type { InferResponseType } from "hono";
import {
  CheckCircleIcon,
  CircleXIcon,
  LoaderCircleIcon,
  MoreHorizontalIcon,
} from "lucide-solid";
import { toast } from "solid-sonner";

interface BansTableRowActionsProps {
  data: InferResponseType<typeof hc.bans.$get>[number];
}

export const BansTableRowActions = (props: BansTableRowActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={(
          props: PolymorphicCallbackProps<
            ButtonProps,
            DropdownMenuTriggerOptions,
            DropdownMenuTriggerRenderProps
          >,
        ) => (
          <Button variant="ghost" class="h-8 w-8 p-0" {...props}>
            <span class="sr-only">Open menu</span>
            <MoreHorizontalIcon class="h-4 w-4" />
          </Button>
        )}
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuGroupLabel>Actions</DropdownMenuGroupLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const id = props.data.id;
              if (!id) {
                return toast.error("Unable to delete ban");
              }
              toast.promise(
                async () => {
                  const resp = await hc.bans[":id"].$delete({
                    param: { id },
                  });
                  if (!resp.ok) {
                    throw new Error(resp.statusText);
                  }
                  return resp.json();
                },
                {
                  loading: <LoaderCircleIcon class="size-4 animate-spin" />,
                  success: (
                    <span>
                      <CheckCircleIcon class="mr-2 size-4 text-green-500">
                        Ban deleted
                      </CheckCircleIcon>
                    </span>
                  ),
                  error: (
                    <span>
                      <CircleXIcon class="mr-2 size-4 text-red-500" />
                      Unable to delete ban
                    </span>
                  ),
                },
              );
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
