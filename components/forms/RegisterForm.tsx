"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { PatientFormValidation } from "@/lib/validation";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOption, IdentificationTypes } from "@/constance";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";

import { FileUploader } from "../FileUploader";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.action";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<
    z.infer<typeof PatientFormValidation>,
    object,
    z.infer<typeof PatientFormValidation>
  >({
    // @ts-expect-error "ignore"
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthDate: new Date(),
      gender: "male" as const,
      address: "",
      occupation: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      primaryPhysician: "",
      insuranceProvider: "",
      insurancePolicyNumber: "",
      allergies: "",
      currentMedication: "",
      familyMedicalHistory: "",
      pastMedicalHistory: "",
      identificationType: "",
      identificationNumber: "",
      identificationDocument: [],
      treatmentConsent: false,
      disclosureConsent: false,
      privacyConsent: false,
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    // Store file info in form data as
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        treatmentConsent: values.treatmentConsent, // ← add this
        disclosureConsent: values.disclosureConsent, // ← add this
        privacyConsent: values.privacyConsent,
      };

      const newPatient = await registerPatient(patient);

      if (newPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-12 flex-1" onSubmit={form.handleSubmit(onSubmit)}>
      <section className="mb-12 space-y-4">
        <h1 className="header">Welcome👋</h1>
        <p className="text-dark-700">Tell us more about yourself</p>
      </section>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Personal Information</h2>
        </div>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          placeholder="Full Name"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="john@example.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
            className="flex-1"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            className="flex-1"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of Birth"
            className="flex-1"
          />
          {/* <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            className="flex-1"
            renderSkeleton={(field) => (
              <RadioGroup
                className="flex h-11 gap-6 xl:justify-between"
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                {GenderOption.map((option) => (
                  <div key={option} className="radio-group">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          /> */}
          <CustomFormField
            fieldType={FormFieldType.GENDER}
            control={form.control}
            name="gender"
            label="Gender"
            className="flex-1"
          >
            {GenderOption.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </CustomFormField>
        </div>
      </section>

      <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="address"
          label="Address"
          placeholder="Enter your Address"
          className="flex-1"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="occupation"
          label="Occupation"
          placeholder="Please enter your occupation"
          className="flex-1"
        />
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="emergencyContactName"
          label="Emergency contact name"
          placeholder="Guardian's name"
          className="flex-1"
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="emergencyContactNumber"
          label="Emergency contact number"
          placeholder="+1 (555) 000-0000"
          className="flex-1"
        />
      </div>

      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Medical Information </h2>
        </div>
      </section>

      {/* <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="primaryPhysician"
        label="Primary Physician"
        placeholder="select a physician"
        className="flex-1"
      >
        {Doctors.map((doctor) => (
          <SelectItem value={doctor.name} key={doctor.name}>
            <div className="flex cursor-pointer items-center gap-2">
              <Image
                src={doctor.image}
                width={32}
                height={32}
                alt={doctor.name}
                className="fo"
              />
            </div>
          </SelectItem>
        ))}
      </CustomFormField> */}
      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="primaryPhysician"
        label="Primary Physician"
        placeholder="Select a physician"
      >
        {Doctors.map((doctor) => (
          <SelectItem value={doctor.name} key={doctor.name}>
            <div className="flex cursor-pointer items-center gap-2">
              <Image
                src={doctor.image}
                width={32}
                height={32}
                alt={doctor.name}
                className="rounded-full border border-dark-500"
              />
              <p>{doctor.name}</p>
            </div>
          </SelectItem>
        ))}
      </CustomFormField>

      <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="insuranceProvider"
          label="Insurance provider"
          placeholder="insurance name"
          className="flex-1"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="insurancePolicyNumber"
          label="Insurance policy number"
          placeholder="Please enter your occupation"
          className="flex-1"
        />
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="allergies"
          label="Allergies (if any) "
          placeholder="Please enter your allergies "
          className="flex-1"
        />

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="currentMedication"
          label="Current meidcation (if any)"
          placeholder="What is your current medication ?"
          className="flex-1"
        />
      </div>

      <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="familyMedicalHistory"
          label="Family medical hisory "
          placeholder=" Enter family medical hisory"
          className="flex-1"
        />

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="pastMedicalHistory"
          label="Past medical history"
          placeholder="Enter past medical history"
          className="flex-1"
        />
      </div>
      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Identification and Verification </h2>
        </div>
      </section>

      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="identificationType"
        label="identification type"
        placeholder="Select  an indentification type"
      >
        {IdentificationTypes.map((type) => (
          <SelectItem value={type} key={type}>
            {type}
          </SelectItem>
        ))}
      </CustomFormField>

      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name="identificationNumber"
        label="ID number"
        placeholder="Please enter your occupation"
        className="flex-1"
      />

      <CustomFormField
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name="identificationDocument"
        label="Scanned Copy of Identification Document"
        renderSkeleton={(field) => (
          <FileUploader files={field.value} onChange={field.onChange} />
        )}
      />
      <section className="space-y-6">
        <div className="mb-9 space-y-1">
          <h2 className="sub-header">Consent and Privacy</h2>
        </div>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to receive treatment for my health condition."
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to the use and disclosure of my health
            information for treatment purposes."
        />

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I acknowledge that I have reviewed and agree to the
            privacy policy"
        />
      </section>

      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  );
};

export default RegisterForm;
