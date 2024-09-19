import { useBanDetails } from "@/api/bans/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormSelect,
  FormSlider,
  FormSubmitButton,
  FormTextField,
} from "@/components/ui/form";
import { BanStatusType, RegionType } from "@/db/schema";
import { QueryBoundary } from "@/lib/vike-solid-query";
import { createForm, setValue, setValues } from "@modular-forms/solid";
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

        return (
          <div class="h-full max-w-screen-lg items-center p-8">
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
              <EditBan.Form class="grid grid-flow-row grid-cols-4 gap-4 p-8">
                <Card class="col-span-2">
                  <CardHeader>
                    <CardTitle class="font-semibold text-lg">
                      Location
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div class="grid grid-flow-col grid-rows-subgrid items-center gap-2">
                      <EditBan.Field name="regionType">
                        {(field, props) => (
                          <FormSelect
                            {...props}
                            label="Type"
                            options={Object.entries(RegionType).map(
                              ([label, value]) => ({ label, value }),
                            )}
                            placeholder="Location type"
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
                            label="Name"
                            placeholder="California"
                            value={field.value}
                            error={field.error}
                            required
                          />
                        )}
                      </EditBan.Field>
                    </div>
                    <EditBan.Field name="status" type="string">
                      {(field, props) => (
                        <FormSelect
                          {...props}
                          multiline
                          label="Status"
                          options={Object.entries(BanStatusType).map(
                            ([label, value]) => ({ label, value }),
                          )}
                          placeholder="Enter a condition..."
                          value={field.value}
                          error={field.error}
                          required
                        />
                      )}
                    </EditBan.Field>
                    <EditBan.Field name="status" type="string">
                      {(field, props) => (
                        <FormSelect
                          {...props}
                          multiline
                          label="Status"
                          options={Object.entries(BanStatusType).map(
                            ([label, value]) => ({ label, value }),
                          )}
                          placeholder="Enter a condition..."
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
                          multiline
                          label="Condition"
                          placeholder="Enter a condition..."
                          value={field.value}
                          error={field.error}
                          required
                        />
                      )}
                    </EditBan.Field>
                  </CardContent>
                </Card>

                <Card class="col-span-2">
                  <CardHeader>
                    <CardTitle class="font-semibold text-lg">
                      Penalties
                    </CardTitle>
                  </CardHeader>
                  <CardContent class="flex flex-col gap-10 px-10">
                    <EditBan.Field name="fineMin" type="number">
                      {(fieldMin, propsMin) => (
                        <EditBan.Field name="fineMax" type="number">
                          {(fieldMax, propsMax) => (
                            <FormSlider
                              {...propsMin}
                              {...propsMax}
                              label="Fine"
                              value={[
                                fieldMin.value ?? 0,
                                fieldMax.value ?? 100,
                              ]}
                              onChange={(value) => {
                                console.log(value);
                                setValue(form, "fineMin", value[0]);
                                setValue(form, "fineMax", value[1]);
                              }}
                              error={fieldMin.error || fieldMax.error}
                              required
                            />
                          )}
                        </EditBan.Field>
                      )}
                    </EditBan.Field>
                    <EditBan.Field name="jailMin" type="number">
                      {(fieldMin, propsMin) => (
                        <EditBan.Field name="jailMax" type="number">
                          {(fieldMax, propsMax) => (
                            <FormSlider
                              {...propsMin}
                              {...propsMax}
                              label="Jail"
                              onChange={(value) => {
                                setValues(form, {
                                  jailMin: value[0],
                                  jailMax: value[1],
                                });
                              }}
                              value={[
                                fieldMin.value ?? 0,
                                fieldMax.value ?? 100,
                              ]}
                              error={fieldMin.error || fieldMax.error}
                              required
                            />
                          )}
                        </EditBan.Field>
                      )}
                    </EditBan.Field>
                  </CardContent>
                </Card>
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
