'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { academicYearSchema, AcademicYearFormData } from '@/schemas/academicYear';
import type { AcademicYear } from '@/types/type';
import api from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AcademicYearFormProps {
  initialData?: AcademicYear;
}

export function AcademicYearForm({ initialData }: AcademicYearFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      label: initialData?.label || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: AcademicYearFormData) => {
      const url = isEditMode ? `/year/${initialData?.id}` : '/year';
      const method = isEditMode ? 'put' : 'post';
      return api[method](url, data);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Year Updated!" : "Year Created successfully !");
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
      router.push('/academic-year');
    },
    onError: (error) => toast.error("Fail of the operation", { 
        //description: error.response?.data?.message 
    }),
  });

  const onSubmit = (data: AcademicYearFormData) => mutation.mutate(data);

  return (
    <Card className="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit academic year" : "Create academic year"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <Label htmlFor="label">Label of Year</Label>
            <Input id="label" {...register('label')} disabled={isSubmitting} placeholder="Ex: 2024-2025" />
            {errors.label && <p className="text-sm text-red-500">{errors.label.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Save...' : isEditMode ? 'Update' : 'Create'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}