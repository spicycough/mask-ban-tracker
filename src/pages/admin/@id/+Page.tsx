import { useBanDetails } from "@/api/bans/queries";
import {
  FormSelect,
  FormSubmitButton,
  FormTextField,
} from "@/components/ui/form";
import { RegionType } from "@/db/schema";
import { QueryBoundary } from "@/lib/vike-solid-query";
import { createForm } from "@modular-forms/solid";
import { createEffect } from "solid-js";
import { usePageContext } from "vike-solid/usePageContext";

export default function Page() {
  const banId = usePageContext().routeParams.id;

  const query = useBanDetails(banId);

  return (
    <QueryBoundary query={query}>
      {(data) => {
        const [form, EditBan] = createForm({
          initialValues: data,
        });

        createEffect(() => {
          console.log(data);
        });

        return (
          <div class="h-full p-8">
            <div class="space-y-8 rounded-lg border border-border bg-secondary p-10">
              <div class="flex items-center justify-between space-y-2">
                <div>
                  <h2 class="text-muted-foreground">
                    View, create, edit, and delete ban.
                  </h2>
                  <h1 class="font-bold text-2xl tracking-tight">
                    {data?.regionName}
                  </h1>
                </div>
              </div>
              <EditBan.Form class="grid grid-flow-row grid-cols-2 gap-4">
                <div class="items-center justify-between space-y-2">
                  <h3 class="font-semibold text-lg">General</h3>
                  <EditBan.Field name="regionType">
                    {(field, props) => (
                      <FormSelect
                        {...props}
                        label="Region type"
                        options={Object.entries(RegionType).map(
                          ([label, value]) => ({ label, value }),
                        )}
                        placeholder="Enter a region name..."
                        value={field.value}
                        error={field.error}
                        required
                      />
                    )}
                  </EditBan.Field>
                  <EditBan.Field name="regionName" type="string">
                    {(field, props) => (
                      <FormTextField
                        {...props}
                        label="Region"
                        placeholder="Enter a region name..."
                        value={field.value}
                        error={field.error}
                        required
                      />
                    )}
                  </EditBan.Field>
                  <EditBan.Field name="condition" type="string">
                    {(field, props) => (
                      <FormTextField
                        {...props}
                        label="Condition"
                        placeholder="Enter a condition..."
                        value={field.value}
                        error={field.error}
                        required
                      />
                    )}
                  </EditBan.Field>
                </div>

                <div class="items-center justify-between space-y-2">
                  <h3 class="font-semibold text-lg">Penalties</h3>
                  <EditBan.Field name="fineMin" type="number">
                    {(field, props) => (
                      <FormTextField
                        {...props}
                        label="Fine (minimum)"
                        placeholder="Enter a dollar amount..."
                        value={field.value}
                        error={field.error}
                        required
                      />
                    )}
                  </EditBan.Field>
                  <EditBan.Field name="fineMax" type="number">
                    {(field, props) => (
                      <FormTextField
                        {...props}
                        label="Fine (maximum)"
                        placeholder="Enter a dollar amount..."
                        value={field.value}
                        error={field.error}
                        required
                      />
                    )}
                  </EditBan.Field>
                </div>
                <div class="col-span-2">
                  <FormSubmitButton
                    type="submit"
                    form={form}
                    error="Please correct errors."
                    variant="default"
                  >
                    Save
                  </FormSubmitButton>
                </div>
              </EditBan.Form>
            </div>
          </div>
        );
      }}
    </QueryBoundary>
  );
}
