"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);
    try {
      // const userData = { name, email, phone };
      // const user = await createUser(userData);
      // if (user) router.push(`/patients/${user.$id}/register`);
    } catch (error) {}
    console.log(error);
  }

  return (
    <form className="space-y-6 flex-1" onSubmit={form.handleSubmit(onSubmit)}>
      <section className="mb-12 space-y-4">
        <h1 className="header">Hi there 👋</h1>
        <p className="text-dark-700">Schedule your first appointment.</p>
      </section>

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="name"
        label="Full Name"
        placeholder="John Doe"
        iconSrc="/assets/icons/user.svg"
        iconAlt="user"
      />

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="email"
        label="Email"
        placeholder="john@example.com"
        iconSrc="/assets/icons/email.svg"
        iconAlt="email"
      />

      <CustomFormField
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name="phone"
        label="Phone Number"
        placeholder="+1 (555) 000-0000"
      />

      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>

      {/* <Field orientation="horizontal">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </Field> */}
    </form>
  );
};

export default PatientForm;
