import { z } from 'zod';

export type UserCheckInFormData = z.infer<typeof userCheckInFormSchema>;

export const userCheckInFormSchema = z.object({
  scannedValue: z.string().min(1, 'Secret value is required'),
});
