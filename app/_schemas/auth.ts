import { z } from 'zod'

export const LoginFormSchema = z.object({
  userName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})

export type FormState = {
  errors?: {
    userName?: string[];
    password?: string[];
    general?: string[];
  };
  message?: string;
  accessToken?: string;
  refreshToken?: string;
} | undefined;
