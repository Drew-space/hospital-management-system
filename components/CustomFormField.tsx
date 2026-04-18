import React from "react";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Control, Controller, FieldValues } from "react-hook-form";
import { Input } from "./ui/input";

interface CustomProps<T extends FieldValues> {
  control: Control<T>;
}

const CustomFormField = <T extends FieldValues>({
  control,
}: CustomProps<T>) => {
  return (
    <FieldGroup>
      <Controller
        name={"name" as any}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-rhf-demo-title">Bug Title</FieldLabel>
            <Input
              {...field}
              id="form-rhf-demo-title"
              aria-invalid={fieldState.invalid}
              placeholder="Login button not working on mobile"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
};

export default CustomFormField;
