'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { studentSchema, StudentFormData } from '@/schemas/student';
import { Gender, type Student } from '@/types/type';
import api from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';


// Le composant accepte des données initiales pour le mode "édition"
interface StudentFormProps {
  initialData?: Student;
  isReadOnly?: boolean;
}

export function StudentForm({ initialData, isReadOnly = false }: StudentFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;
  

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    // Pré-remplit le formulaire si on est en mode édition
    defaultValues: {
      matricule: initialData?.matricule || '',
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      birthdate: initialData?.birthdate || '',
      phoneParent: initialData?.phoneParent || '',
      gender: initialData?.gender,
    },
  });

  const isDisabled = isSubmitting || isReadOnly;

  // Une seule mutation qui gère à la fois la création (POST) et la mise à jour (PUT)
  const mutation = useMutation({
    mutationFn: (studentData: StudentFormData) => {
      const url = isEditMode ? `/student/${initialData?.id}` : '/student';
      const method = isEditMode ? 'put' : 'post';
      return api[method](url, studentData);
    },
    onSuccess: () => {
      const message = isEditMode ? "Student Updated !" : "Student created successfully !";
      toast.success(message);
      // Invalide le cache pour que la liste des élèves se rafraîchisse
      queryClient.invalidateQueries({ queryKey: ['student'] });
      //
      if (isEditMode) {
      queryClient.invalidateQueries({ queryKey: ['student', initialData.id] });
    }
    
      router.push('/students');
    },
    onError: (error) => {
      //const errorMessage = error.response?.data?.message || "Une erreur est survenue.";
      toast.error(`Failed ${isEditMode ? 'to update' : 'to register'}`, {
        //description: errorMessage,
      });
    }
  });

  const onSubmit = (data: StudentFormData) => {
    mutation.mutate(data);
  };

  return (
    <Card className="max-w-3xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>
            {isEditMode ? `Modification of ${initialData.firstName} ${initialData.lastName}` : "student information"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">Surname</Label>
              <Input id="firstName" {...register('firstName')} disabled={isSubmitting} />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Name</Label>
              <Input id="lastName" {...register('lastName')} disabled={isSubmitting} />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="birthdate">Date of birth</Label>
              <Input id="birthdate" type="date" {...register('birthdate')} disabled={isSubmitting} />
              {errors.birthdate && <p className="text-sm text-red-500">{errors.birthdate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Genre</Label>
              <select id="gender" {...register('gender')} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="">Select...</option>
                {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
            <Label htmlFor="phoneParent">Parent phone</Label>
            <Input id="phoneParent" type="tel" {...register('phoneParent')} disabled={isSubmitting} />
            {errors.phoneParent && <p className="text-sm text-red-500">{errors.phoneParent.message}</p>}
          </div>
          <div className="space-y-1.5">
              <Label htmlFor="matricule">Matricule</Label>
              <Input id="matricule" {...register('matricule')} />
              {errors.matricule && <p className="text-sm text-red-500">{errors.matricule.message}</p>}
            </div>
          </div>
          
        </CardContent>
        {!isReadOnly && (
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : isEditMode ? 'Update information' : 'Register student'}
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  );
}