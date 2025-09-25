import { z } from 'zod';

export type UserRegistrationFormData = z.infer<typeof userRegistrationFormSchema>;

export const userRegistrationFormSchema = z.object({
  email: z.string().min(2).max(100).email(),
  password: z.string().min(6),
  firstName: z.string().min(2).max(100)
});
