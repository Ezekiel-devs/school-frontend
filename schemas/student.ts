import * as z from 'zod';
import { Gender } from '@/types/type';

export const studentSchema = z.object({
  matricule: z.string().min(1, 'Le matricule est requis.'),
  firstName: z.string().min(1, 'Le prénom est requis.'),
  lastName: z.string().min(1, 'Le nom est requis.'),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)').min(1, 'La date de naissance est requise.'),
  phoneParent: z.string().min(1, 'Le téléphone du parent est requis.'),
  gender: z.nativeEnum(Gender, {
    //errorMap: () => ({ message: 'Le genre est requis.' }),
  }),
});