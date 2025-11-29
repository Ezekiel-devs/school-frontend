import { z } from 'zod';

export const subjectSchema = z.object({
  name: z.string().min(2, { message: 'The name of the subject must contain at least 2 characters.' }),
  code: z.string().min(2, { message: 'The code must contain at least 2 characters.' }).max(10),
  // z.coerce.number() essaie de convertir la valeur en nombre
    credit: z.string()
    .min(1, { message: "Credit is required." })
    .regex(/^[1-9]\d*$/, { message: "The credit must be a positive whole number." }),
  description: z.string().optional(), // Description est optionnelle
});

export type SubjectFormData = z.infer<typeof subjectSchema>;