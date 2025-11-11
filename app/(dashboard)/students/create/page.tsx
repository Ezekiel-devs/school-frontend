'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { studentSchema } from '@/schemas/student';
import { Gender } from '@/types/type';
import api from '@/lib/api';
import { PageHeader } from '@/components/ui/pageHeader';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type StudentFormData = z.infer<typeof studentSchema>;

async function createStudent(newStudent: StudentFormData) {
  const { data } = await api.post('/student', newStudent);
  return data;
}

export default function CreateStudentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const mutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student'] });
      // Idéalement, afficher une notification "toast" ici
      alert('Élève inscrit avec succès !');
      router.push('/student');
    },
    onError: (error) => {
      console.error('Erreur lors de la création:', error);
      //alert(error.response?.data?.message || 'Une erreur est survenue.');
    },
  });

  const onSubmit = (data: StudentFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Inscrire un nouvel élève" />
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="matricule">Matricule</Label>
              <Input id="matricule" {...register('matricule')} />
              {errors.matricule && <p className="text-sm text-red-500">{errors.matricule.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender">Genre</Label>
              <select id="gender" {...register('gender')} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="">Sélectionner...</option>
                {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="birthdate">Date de naissance</Label>
              <Input id="birthdate" type="date" {...register('birthdate')} />
              {errors.birthdate && <p className="text-sm text-red-500">{errors.birthdate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phoneParent">Téléphone Parent</Label>
              <Input id="phoneParent" type="tel" {...register('phoneParent')} />
              {errors.phoneParent && <p className="text-sm text-red-500">{errors.phoneParent.message}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Inscription en cours...' : 'Inscrire l\'élève'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}