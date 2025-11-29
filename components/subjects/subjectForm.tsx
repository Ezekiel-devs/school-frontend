'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { subjectSchema, SubjectFormData } from '@/schemas/subject';
import type { Subject } from '@/types/type';
import api from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface SubjectFormProps {
  initialData?: Subject;
}

export function SubjectForm({ initialData }: SubjectFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      credit: initialData?.credit ? String(initialData.credit) : '',
      description: initialData?.description || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (formData: SubjectFormData) => {
    const dataToSend = {
        ...formData,
        credit: Number(formData.credit),
      };

      const url = isEditMode ? `/subject/${initialData?.id}` : '/subject';
      const method = isEditMode ? 'put' : 'post';
      return api[method](url, dataToSend);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Course Updated !" : "Course created successfully !");
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      router.push('/subjects');
    },
    onError: (error) => toast.error("Opeartion Failed", { 
        //description: error.response?.data?.message 
    }),
  });

  const onSubmit = (data: SubjectFormData) => mutation.mutate(data);

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit subject" : "Create a new subject"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="name">Label course</Label>
              <Input id="name" {...register('name')} disabled={isSubmitting} placeholder="Ex: Mathematics" />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="code">Code</Label>
              <Input id="code" {...register('code')} disabled={isSubmitting} placeholder="MATHS" />
              {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="credit">Crédits</Label>
            <Input id="credit" type='number' {...register('credit')} disabled={isSubmitting} placeholder="4" />
            {errors.credit && <p className="text-sm text-red-500">{errors.credit.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optionnal)</Label>
            <Textarea id="description" {...register('description')} disabled={isSubmitting} placeholder="Description of the subject..." />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Recording...' : isEditMode ? 'Update' : 'Create subject'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}