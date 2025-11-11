// src/schemas/auth.ts
import * as z from 'zod';
import { Gender, Role } from '@/types/type'; // Importez vos rôles

// Schéma de validation pour le formulaire de connexion
export const loginSchema = z.object({
  email: z.string().email('L\'email est invalide.').min(1, 'L\'email est requis.'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.'),
});

// Schéma de validation pour la création/modification d'un membre du staff
export const staffSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis.'),
  lastName: z.string().min(1, 'Le nom est requis.'),
  email: z.string().email('L\'email est invalide.').min(1, 'L\'email est requis.'),
  phone: z.string().optional(), // Ou z.string().min(10, 'Numéro invalide').max(15).optional()
  address: z.string().optional(),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)').min(1, 'La date de naissance est requise.'),
  gender: z.nativeEnum(Gender, {
    //errorMap: () => ({ message: 'Le genre est requis.' }),
  }),
  role: z.nativeEnum(Role, {
    //errorMap: () => ({ message: 'Le rôle est requis.' }),
  }),
  isActive: z.boolean().default(true),
  // Le mot de passe ne serait pas inclus ici pour la modification,
  // seulement pour la création ou un formulaire de changement de mot de passe séparé.
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères.').optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // Logique de validation pour les mots de passe si présents
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'Les mots de passe ne correspondent pas.',
  path: ['confirmPassword'],
});