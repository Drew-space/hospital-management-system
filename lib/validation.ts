import z from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters.")
    .max(100, "Name must be at most 50 characters."),
  email: z.string().email(),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});
