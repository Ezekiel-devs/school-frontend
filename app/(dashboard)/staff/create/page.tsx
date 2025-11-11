'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { staffSchema } from '@/schemas/auth';
import { Gender, Role } from '@/types/type';
import api from '@/lib/api';

// Inférence du type à partir du schéma Zod
type StaffFormData = z.infer<typeof staffSchema>;

// La fonction qui appelle l'API pour créer un nouveau membre du staff
async function createStaff(newStaff: StaffFormData) {
  // On retire confirmPassword qui n'est pas utile pour le backend
  const { confirmPassword, ...staffData } = newStaff;
  const { data } = await api.post('/staff', staffData); // Endpoint de votre API Express
  return data;
}

export default function CreateStaffPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
  });

  const mutation = useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      // Invalider les requêtes pour la liste du staff pour la rafraîchir
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      alert('Membre du staff créé avec succès !');
      router.push('/staff'); // Rediriger vers la liste du staff
    },
    onError: (error: any) => {
      console.error('Erreur lors de la création:', error);
      // Afficher une erreur plus spécifique si l'API en renvoie une (ex: email déjà utilisé)
      alert(error.response?.data?.message || 'Une erreur est survenue.');
    },
  });

  const onSubmit = (data: StaffFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau membre du personnel</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Prénom et Nom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="firstName">Prénom</label>
            <input id="firstName" type="text" {...register('firstName')} className="form-input" />
            {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Nom</label>
            <input id="lastName" type="text" {...register('lastName')} className="form-input" />
            {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} className="form-input" />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        
        {/* Date de naissance et Téléphone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
                <label htmlFor="birthdate">Date de naissance</label>
                <input id="birthdate" type="date" {...register('birthdate')} className="form-input" />
                {errors.birthdate && <p className="error-message">{errors.birthdate.message}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input id="phone" type="tel" {...register('phone')} className="form-input" />
                {errors.phone && <p className="error-message">{errors.phone.message}</p>}
            </div>
        </div>

        {/* Genre et Rôle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="gender">Genre</label>
            <select id="gender" {...register('gender')} className="form-input">
              <option value="">Sélectionner un genre</option>
              {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {errors.gender && <p className="error-message">{errors.gender.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="role">Rôle</label>
            <select id="role" {...register('role')} className="form-input">
              <option value="">Sélectionner un rôle</option>
              {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {errors.role && <p className="error-message">{errors.role.message}</p>}
          </div>
        </div>
        
        {/* Mot de passe et Confirmation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="password" {...register('password')} className="form-input" />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input id="confirmPassword" type="password" {...register('confirmPassword')} className="form-input" />
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="button button-primary" disabled={isSubmitting || mutation.isPending}>
            {mutation.isPending ? 'Création en cours...' : 'Créer le membre'}
          </button>
        </div>
      </form>
    </div>
  );
}