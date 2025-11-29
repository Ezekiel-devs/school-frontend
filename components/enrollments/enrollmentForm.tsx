'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { enrollmentSchema, EnrollmentFormData } from '@/schemas/enrollment';
import type { Classroom, AcademicYear, Enrollment } from '@/types/type';
import api from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface EnrollmentFormProps {
  studentId: string;
  initialData?: Enrollment;
}

export function EnrollmentForm({ studentId, initialData  }: EnrollmentFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  // Fetch des classes et des années académiques pour les selects
  const { data: classrooms, isLoading: isLoadingClassrooms } = useQuery<Classroom[]>({
    queryKey: ['classrooms'],
    queryFn: async () => (await api.get('/classroom')).data,
  });
  const { data: academicYears, isLoading: isLoadingYears } = useQuery<AcademicYear[]>({
    queryKey: ['academicYears'],
    queryFn: async () => (await api.get('/year')).data,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
        yearId: initialData?.yearId || '',
        classId: initialData?.classId || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: EnrollmentFormData) => {
      const url = isEditMode ? `/enrollment/${initialData.id}` : '/enrollment';
      const method = isEditMode ? 'put' : 'post';
      const payload = isEditMode ? data : { ...data, studentId };
      return api[method](url, payload);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Enrollment updated !" : "Student enroll !");
      queryClient.invalidateQueries({ queryKey: ['enrollments', studentId] });
      // Redirige vers la page d'historique cette fois
      router.push(`/students/${studentId}/history`);
    },
    onError: (error) => toast.error("Operation Failed", { 
      //description: error.response?.data?.message 
    }),
  });

  const onSubmit = (data: EnrollmentFormData) => mutation.mutate(data);

  const isLoading = isLoadingClassrooms || isLoadingYears || isSubmitting;

  return (
    <Card className="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit enrollment" : "Register student"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="yearId">Academic year</Label>
            <select id="yearId" {...register('yearId')} disabled={isLoading} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2">
              <option value="">Select a year...</option>
              {academicYears?.map(year => <option key={year.id} value={year.id}>{year.label}</option>)}
            </select>
            {errors.yearId && <p className="text-sm text-red-500">{errors.yearId.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="classId">Class</Label>
            <select id="classId" {...register('classId')} disabled={isLoading} className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2">
              <option value="">Select a class...</option>
              {classrooms?.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
            </select>
            {errors.classId && <p className="text-sm text-red-500">{errors.classId.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isSubmitting ? 'Registration...' : 'Register'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}