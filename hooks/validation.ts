import { z } from "zod";

const gmailOnlySchema = z
  .string()
  .email("Please enter a valid email address")
  .refine((email) => email.endsWith("@gmail.com"), {
    message: "Only Gmail addresses are allowed (@gmail.com)",
  });

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long");

const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: gmailOnlySchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const useValidation = () => {
  return {
    gmailOnlySchema,
    passwordSchema,
    signupSchema,
  };
};

export { gmailOnlySchema, passwordSchema, signupSchema };
