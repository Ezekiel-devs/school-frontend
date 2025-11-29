import { z } from 'zod';

export const enrollmentSchema = z.object({
  // `studentId` viendra du contexte de la page (on est sur la page d'un élève)
  // et ne sera pas dans le formulaire visible.
  
  // L'utilisateur devra choisir l'année académique et la classe
  classId: z.string().min(1, { message: "Please select a class." }),
  yearId: z.string().min(1, { message: "Please select an academic year." }),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;