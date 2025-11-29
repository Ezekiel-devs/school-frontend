import { z } from 'zod';

export const teachSchema = z.object({
  // `classId` et `academicYearId` viendront du contexte de la page.
  subjectId: z.string().min(1, { message: "Please select a subject." }),
  staffId: z.string().min(1, { message: "Please select a teacher." }),
});

export type TeachFormData = z.infer<typeof teachSchema>;