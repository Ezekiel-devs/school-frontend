import * as z from 'zod';
import { Gender } from '@/types/type';

export const studentSchema = z.object({
  matricule: z.string().min(1, 'The matricule is required.'),
  firstName: z.string().min(1, 'The surname is required.'),
  lastName: z.string().min(1, 'The name is required.'),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format of Date invalid (YYYY-MM-DD)').min(1, 'Date of birth required.'),
  phoneParent: z.string().min(1, 'The parent contact is required.'),
  gender: z.enum(['Male', 'Female']),
});

export type StudentFormData = z.infer<typeof studentSchema>;