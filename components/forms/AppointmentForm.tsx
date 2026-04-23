"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import {
  getAppointmentSchema,
  PatientFormValidation,
  UserFormValidation,
} from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.action";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { Doctors } from "@/constance";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.action";
import { Appointment } from "@/lib/actions/appwrite.types";

const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<
    z.infer<typeof AppointmentFormValidation>,
    object,
    z.infer<typeof AppointmentFormValidation>
  >({
    // @ts-expect-error - zod coerce.date type inference quirk
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment?.primaryPhysician ?? "",
      schedule: appointment ? new Date(appointment.schedule) : new Date(),
      reason: appointment?.reason ?? "",
      note: appointment?.note ?? "",
      cancellationReason: appointment?.cancellationReason ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          note: values.note,
        };

        const newAppointment = await createAppointment(appointmentData);
        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`,
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);
        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Apppointment";
  }

  return (
    <form className="space-y-6 flex-1" onSubmit={form.handleSubmit(onSubmit)}>
      <section className="mb-12 space-y-4">
        <h1 className="header">New Appointment </h1>
        <p className="text-dark-700">Request a new appointment in seconds</p>
      </section>

      {type !== "cancel" && (
        <>
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

          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="schedule"
            label="Expected appointment date"
            className="flex-1"
            showTimeSelect
            dateFormat="MM/dd/yyyy - h:mm aa"
          />

          <div className="flex max-sm:flex-col flew-row gap-6">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="reason"
              label=" Reason for appointment"
              placeholder="Enter reason for appointment "
              className="flex-1"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="note"
              label="Notes"
              placeholder="Enter notes"
              className="flex-1"
            />
          </div>
        </>
      )}

      {type === "cancel" && (
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="cancellationReason"
          label=" Reason for cancellation"
          placeholder="Enter reason for cancellation  "
          className="flex-1"
        />
      )}

      <SubmitButton
        isLoading={isLoading}
        className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
      >
        {buttonLabel}
      </SubmitButton>
    </form>
  );
};

export default AppointmentForm;
