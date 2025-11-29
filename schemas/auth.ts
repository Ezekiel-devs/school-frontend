// src/schemas/auth.ts
import * as z from 'zod';
import { Gender, Role } from '@/types/type'; // Importez vos rôles

// Schéma de validation pour le formulaire de connexion
export const loginSchema = z.object({
  email: z.string().email('Invalid email.').min(1, 'Email is required'),
  password: z.string().min(6, 'The password must contain at least 6 characters.'),
});

// Schéma de validation pour la création/modification d'un membre du staff
export const staffSchema = z.object({
  firstName: z.string().min(1, 'The surname is required.'),
  lastName: z.string().min(1, 'The name is required.'),
  email: z.string().email('Invalid email.').min(1, 'Email is required.'),
  phone: z.string().optional(), // Ou z.string().min(10, 'Numéro invalide').max(15).optional()
  address: z.string().optional(),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid Format of date  (YYYY-MM-DD)').min(1, 'The date of birth is required.'),
  gender: z.nativeEnum(Gender, {
    //errorMap: () => ({ message: 'Le genre est requis.' }),
  }),
  role: z.nativeEnum(Role, {
    //errorMap: () => ({ message: 'Le rôle est requis.' }),
  }),
  isActive: z.boolean().default(true),
  // Le mot de passe ne serait pas inclus ici pour la modification,
  // seulement pour la création ou un formulaire de changement de mot de passe séparé.
  password: z.string().min(6, 'The password must contain at least 6 caracters.').optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // Logique de validation pour les mots de passe si présents
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'The passwords do not match.',
  path: ['confirmPassword'],
});