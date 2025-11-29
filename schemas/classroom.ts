import { z } from 'zod';

export const classroomSchema = z.object({
  name: z.string().min(2, { message: 'The name of the class must contain at least 2 characters.' }),
  // On utilise l'enum de Prisma/type.ts. Assurez-vous qu'il est bien exporté.
  section: z.enum(['ANGLOPHONE', 'FRANCOPHONE']),
});

export type ClassroomFormData = z.infer<typeof classroomSchema>;