'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { classroomSchema, ClassroomFormData } from '@/schemas/classroom';
import type { Classroom } from '@/types/type';
import api from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ClassroomFormProps {
  initialData?: Classroom;
}

export function ClassroomForm({ initialData }: ClassroomFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClassroomFormData>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: initialData?.name || '',
      section: initialData?.section,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ClassroomFormData) => {
      const url = isEditMode ? `/classroom/${initialData?.id}` : '/classroom';
      const method = isEditMode ? 'put' : 'post';
      return api[method](url, data);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Class updated!" : "Class created successfully !");
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      router.push('/classrooms');
    },
    onError: (error) => toast.error("Operation failed", { 
        //description: error.response?.data?.message 
    }),
  });

  const onSubmit = (data: ClassroomFormData) => mutation.mutate(data);

  return (
    <Card className="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit class" : "Create a new class"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Class name</Label>
            <Input id="name" {...register('name')} disabled={isSubmitting} placeholder="Ex: 6ème A" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="section">Section</Label>
            <select id="section" {...register('section')} disabled={isSubmitting} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Select...</option>
              <option value="ANGLOPHONE">Anglophone</option>
              <option value="FRANCOPHONE">Francophone</option>
            </select>
            {errors.section && <p className="text-sm text-red-500">{errors.section.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Recording...': isEditMode? 'Update': 'Create class'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}