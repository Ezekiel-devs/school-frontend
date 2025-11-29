'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { teachSchema, TeachFormData } from '@/schemas/teach';
import type { Subject, Staff, AcademicYear, Classroom } from '@/types/type';
import api from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AssignTeacherFormProps {
  classroomId: string;
}

export function AssignTeacherForm({ classroomId }: AssignTeacherFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TeachFormData>({
    resolver: zodResolver(teachSchema),
  });

  // Fetch des données nécessaires pour les listes déroulantes et le contexte
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery<Subject[]>({ queryKey: ['subjects'], queryFn: async () => (await api.get('/subject')).data });
  const { data: staff, isLoading: isLoadingStaff } = useQuery<Staff[]>({ queryKey: ['staff'], queryFn: async () => (await api.get('/staff')).data });
  const { data: currentYear, isLoading: isLoadingYear } = useQuery<AcademicYear>({ queryKey: ['currentAcademicYear'], queryFn: async () => (await api.get('/academicyear/current')).data });
  const { data: classroom } = useQuery<Classroom>({ queryKey: ['classroom', classroomId], queryFn: async () => (await api.get(`/classroom/${classroomId}`)).data });


  const mutation = useMutation({
    mutationFn: (data: TeachFormData) => {
      const payload = { 
        ...data, 
        classroomId,
        academicYearId: currentYear?.id,
      };
      if (!payload.academicYearId) {
        throw new Error("The current academic year is not defined.");
      }
      return api.post('/teach', payload);
    },
    onSuccess: () => {
      toast.success("Teacher created successfully!");
      queryClient.invalidateQueries({ queryKey: ['teachings', classroomId] });
      // Redirige vers la page de détails de la classe
      router.push(`/classrooms/${classroomId}`);
    },
    onError: (error) => toast.error("Échec de l'affectation", { 
        //description: error.message || error.response?.data?.message 
    }),
  });

  const onSubmit = (data: TeachFormData) => mutation.mutate(data);
  const isLoading = isLoadingSubjects || isLoadingStaff || isLoadingYear || isSubmitting;

  return (
    <Card className="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Assign a Teacher</CardTitle>
          <CardDescription>
            You assign a teacher to the class **{classroom?.name}** for current academic year **({currentYear?.label})**.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="subjectId">Course</Label>
            <select id="subjectId" {...register('subjectId')} disabled={isLoading} className="w-full flex h-10 rounded-md border p-2">
              <option value="">Select a course...</option>
              {subjects?.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
            </select>
            {errors.subjectId && <p className="text-sm text-red-500">{errors.subjectId.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="staffId">Teacher</Label>
            <select id="staffId" {...register('staffId')} disabled={isLoading} className="w-full flex h-10 rounded-md border p-2">
              <option value="">Select a teacher...</option>
              {staff?.filter(s => s.role === 'TEACHER').map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </select>
            {errors.staffId && <p className="text-sm text-red-500">{errors.staffId.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isSubmitting ? 'Assigning...' : 'Assign'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}