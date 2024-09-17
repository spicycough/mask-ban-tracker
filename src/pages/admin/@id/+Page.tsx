import { FormSubmitButton, FormTextField } from "@/components/ui/form";
import { hc } from "@/lib/hono";
import { QueryBoundary } from "@/lib/vike-solid-query";
import { createForm } from "@modular-forms/solid";
import { createQuery } from "@tanstack/solid-query";
import { createEffect } from "solid-js";
import { usePageContext } from "vike-solid/usePageContext";

export default function Page() {
  // const queryClient = useQueryClient();
  // const hydratedData = queryClient.getQueryData<ResponseType>(["bans", banId]);

  const banId = usePageContext().routeParams.id;

  const query = createQuery(() => ({
    queryKey: ["bans", banId],
    queryFn: async () => {
      const res = await hc.bans[":id"].$get({
        param: { id: banId },
      });

      if (res.status === 200) {
        return res.json();
      }
      throw new Error(res.statusText);
    },
  }));

  createEffect(() => {
    console.log(JSON.stringify(hydratedData, null, 2));
  });

  return (
    <QueryBoundary query={query}>
      {(data) => {
        const [form, EditBan] = createForm({
          initialValues: data,
        });

        return (
          <div class="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div class="flex items-center justify-between space-y-2">
              <div>
                <h2 class="font-bold text-2xl tracking-tight">
                  {data?.regionId}
                </h2>
                <p class="text-muted-foreground">
                  View, create, edit, and delete ban.
                </p>
              </div>
            </div>
            <EditBan.Form class="w-1/2 space-y-2">
              <EditBan.Field name="condition" type="string">
                {(field, props) => (
                  <FormTextField
                    {...props}
                    type="text"
                    label="Condition"
                    placeholder="jane@example.com"
                    value={field.value}
                    error={field.error}
                    required
                  />
                )}
              </EditBan.Field>
              <FormSubmitButton
                type="submit"
                form={form}
                error="Please correct errors."
                variant="default"
              >
                Save
              </FormSubmitButton>
            </EditBan.Form>
          </div>
        );
      }}
    </QueryBoundary>
  );
}
