import { z } from 'zod';

export const academicYearSchema = z.object({
  // Exemple: "2023-2024"
  label: z.string()
    .min(4, { message: 'The label is required' })
    .regex(/^\d{4}-\d{4}$/, { message: 'The format is AAAA-AAAA (eg: 2023-2024).' }),
  // `isCurrent` sera géré par une action séparée, pas dans le formulaire de base.
});

export type AcademicYearFormData = z.infer<typeof academicYearSchema>;