import React from "react";
import Image from "next/image";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface CustomProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  fieldType: FormFieldType;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  renderSkeleton?: (field: any) => React.ReactNode;
}

// Renders the correct input based on fieldType
const RenderField = <T extends FieldValues>({
  field,
  fieldState,
  props,
}: {
  field: any;
  fieldState: any;
  props: CustomProps<T>;
}) => {
  const { fieldType, placeholder, iconSrc, iconAlt, renderSkeleton } = props;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt ?? "icon"}
              width={24}
              height={24}
              className="ml-2"
            />
          )}
          <Input
            {...field}
            placeholder={placeholder}
            className="shad-input border-0"
          />
        </div>
      );

    case FormFieldType.TEXTAREA:
      return (
        <Textarea
          {...field}
          placeholder={placeholder}
          className="shad-textArea"
          disabled={props.disabled}
        />
      );

    case FormFieldType.PHONE_INPUT:
      return (
        <PhoneInput
          defaultCountry="US"
          placeholder={placeholder}
          international
          withCountryCallingCode
          value={field.value}
          onChange={field.onChange}
          className="input-phone"
        />
      );

    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;

    default:
      return null;
  }
};

const CustomFormField = <T extends FieldValues>(props: CustomProps<T>) => {
  const { control, name, label, fieldType } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && fieldType !== FormFieldType.CHECKBOX && (
            <FieldLabel>{label}</FieldLabel>
          )}
          <RenderField field={field} fieldState={fieldState} props={props} />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default CustomFormField;
