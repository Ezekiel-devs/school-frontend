import { Role } from '@/types/type';
import { z } from 'zod';

const roleValues = Object.values(Role) as [string, ...string[]];

// Schéma de base partagé entre création et mise à jour
const baseStaffSchema = z.object({
  firstName: z.string().min(2, { message: 'The surname is required.' }),
  lastName: z.string().min(2, { message: 'The name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional(),
  address: z.string().optional(),
  birthdate: z.string().min(1, { message: 'Date of birth required.' }),
  gender: z.enum(['Male', 'Female']),
  //role: z.enum(['TEACHER', 'CLASS_COORDINATOR', 'DIRECTOR', 'ADMIN']),
  role: z.enum(roleValues),
});

// Schéma pour la CRÉATION (mot de passe obligatoire)
export const createStaffSchema = baseStaffSchema.extend({
  password: z.string().min(6, { message: 'The password must contain at least 6 characters..' }),
})
/*export const createStaffSchema = baseStaffSchema.extend({
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});*/

// Schéma pour la MODIFICATION (mot de passe optionnel)
export const updateStaffSchema = baseStaffSchema.extend({
  password: z.string().min(6, { message: 'The password must contain at least 6 characters.' }).optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine(data => {
  if (data.password) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "The passwords do not match.",
  path: ["confirmPassword"],
});

// Types inférés pour notre formulaire
export type CreateStaffFormData = z.infer<typeof createStaffSchema>;
export type UpdateStaffFormData = z.infer<typeof updateStaffSchema>;