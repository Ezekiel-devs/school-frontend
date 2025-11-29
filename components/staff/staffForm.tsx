'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { createStaffSchema, updateStaffSchema, CreateStaffFormData, UpdateStaffFormData } from '@/schemas/staff';
import type { Staff } from '@/types/type';
import api, { isAxiosError } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface StaffFormProps {
  initialData?: Staff;
}

export function StaffForm({ initialData }: StaffFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const currentSchema = isEditMode ? updateStaffSchema : createStaffSchema;

  const form = useForm<CreateStaffFormData | UpdateStaffFormData>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      birthdate: initialData?.birthdate || '',
      gender: initialData?.gender,
      role: initialData?.role,
      password: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateStaffFormData | UpdateStaffFormData) => {
      const dataToSend = { ...data };
      if (isEditMode && 'password' in dataToSend && !dataToSend.password) {
          delete (dataToSend as Partial<typeof dataToSend>).password;
          /*delete (dataToSend as Partial<typeof dataToSend>).confirmPassword*/;
      }
      
      const url = isEditMode ? `/staff/${initialData?.id}` : '/staff/register';
      const method = isEditMode ? 'put' : 'post';
      return api[method](url, dataToSend);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Staff updated !" : "Staff created successfully !");
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      router.push('/staff');
    },
    /*onError: (error) => toast.error("Échec de l'opération", { 
        //description: error.response?.data?.message 
    }),*/
     onError: (error: unknown) => { // On type d'abord en `unknown`, le type le plus sûr.
      let errorMessage = "An unexpected error has occurred..";

      // On vérifie si c'est bien une erreur Axios
      if (isAxiosError(error)) {
        // À l'intérieur de ce `if`, TypeScript sait que `error` est une AxiosError.
        // On vérifie aussi si `error.response.data.message` existe.
        if (error.response?.data && typeof error.response.data.message === 'string') {
          errorMessage = error.response.data.message;
        }
      } else if (error instanceof Error) {
        // Si c'est une erreur standard de JavaScript
        errorMessage = error.message;
      }
      
      toast.error("Operation failed", { 
        description: errorMessage 
      });
    }
  });

  const onSubmit = (data: CreateStaffFormData | UpdateStaffFormData) => mutation.mutate(data);

  return (
    <Card className="max-w-3xl">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit information" : "Add a new member"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">Surname</Label>
              <Input id="firstName" {...form.register('firstName')} disabled={form.formState.isSubmitting} />
              {form.formState.errors.firstName && <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Name</Label>
              <Input id="lastName" {...form.register('lastName')} disabled={form.formState.isSubmitting} />
              {form.formState.errors.lastName && <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>}
            </div>
          </div>
          
          <div className="space-y-1.5">
              <Label htmlFor="email"> Email</Label>
              <Input id="email" type="email" {...form.register('email')} disabled={form.formState.isSubmitting} />
              {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="birthdate">Date of birth</Label>
              <Input id="birthdate" type="date" {...form.register('birthdate')} disabled={form.formState.isSubmitting} />
              {form.formState.errors.birthdate && <p className="text-sm text-red-500">{form.formState.errors.birthdate.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender">Gender</Label>
              <select id="gender" {...form.register('gender')} disabled={form.formState.isSubmitting} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {form.formState.errors.gender && <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1.5">
              <Label htmlFor="phone">Phone (Optionnal)</Label>
              <Input id="phone" type="tel" {...form.register('phone')} disabled={form.formState.isSubmitting} />
              {form.formState.errors.phone && <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <select id="role" {...form.register('role')} disabled={form.formState.isSubmitting} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                <option value="">Select...</option>
                <option value="TEACHER">Teacher</option>
                <option value="CLASS_COORDINATOR">Class Coordinator</option>
                <option value="DIRECTOR">Director</option>
                <option value="ADMIN">Admin</option>
              </select>
              {form.formState.errors.role && <p className="text-sm text-red-500">{form.formState.errors.role.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Adresse (Optionnal)</Label>
            <Input id="address" {...form.register('address')} disabled={form.formState.isSubmitting} />
            {form.formState.errors.address && <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>}
          </div>

          <hr className="my-4" />
          <h4 className="font-semibold">{isEditMode ? "Change Password" : "Set passworde"}</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register('password')} disabled={form.formState.isSubmitting} placeholder={isEditMode ? "Laisser vide pour ne pas changer" : "••••••••"} />
              {form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
            </div>
            {/*<div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input id="confirmPassword" type="password" {...form.register('confirmPassword')} disabled={/*form.formState.isSubmitting} />
              {/*form.formState.errors.confirmPassword && <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>*/}
            {/*</div>*/}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Recording...' : isEditMode ? 'Update' : 'Add Staff'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}