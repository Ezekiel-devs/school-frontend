'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '@/lib/api';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';
import { GradeEntryForm, gradeEntrySchema } from '@/schemas/grade';

// Type pour les données que l'API renvoie
interface GradeEntryData {
  studentId: string;
  firstName: string;
  lastName: string;
  gradeId: string | null; // L'ID de la note si elle existe déjà
  value: number | null;
}


interface GradeEntryTableProps {
  classId: string;
  subjectId: string;
  sequenceId: string;
}

export function GradeEntryTable({ classId, subjectId, sequenceId }: GradeEntryTableProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const staffId = session?.user?.id;

  // Query pour récupérer la feuille de notes
  const { data: entryData, isLoading } = useQuery<GradeEntryData[]>({
    queryKey: ['grade-sheet', classId, subjectId, sequenceId],
    queryFn: async () => {
      const response = await api.get('/grade/entry-sheet', { 
        params: { classId, subjectId, sequenceId } 
      });
      return response.data;
    },
  });

  const { control, handleSubmit, reset } = useForm<GradeEntryForm>({
    resolver: zodResolver(gradeEntrySchema),
    values: { // Pré-remplir le formulaire avec les données de l'API
      grades: entryData?.map(d => ({ 
        studentId: d.studentId, 
        value: d.value !== null ? String(d.value) : '' 
      })) || []
    }
  });

  const { fields } = useFieldArray({
    control,
    name: "grades",
  });
  
  const saveGradesMutation = useMutation({
      mutationFn: (data: { grades: { studentId: string; value: number | null }[] }) => {
          const payload = data.grades.map(g => ({ ...g, subjectId, sequenceId, staffId }));
          return api.post('/grade/batch', { grades: payload });
      },
      onSuccess: () => {
          toast.success("Notes saved successfully !");
          queryClient.invalidateQueries({ queryKey: ['grade-sheet', classId, subjectId, sequenceId] });
      },
      onError: (error) => toast.error("Erreur", { 
        //description: error.response?.data?.message 
      })
  });
  
  const onSubmit = (data: GradeEntryForm) => {
      const gradesToSave = data.grades.map(g => ({
          studentId: g.studentId,
          value: g.value && g.value.trim() !== '' ? Number(g.value) : null
      }));
      saveGradesMutation.mutate({ grades: gradesToSave });
  };


  if (isLoading) return <div>Loading the notes sheet...</div>;

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">N°</th>
                <th className="p-2 text-left">Name of student</th>
                <th className="p-2 text-left w-32">Mark / 20</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                const student = entryData?.[index];
                return (
                  <tr key={field.id} className="border-b">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{student?.firstName} {student?.lastName}</td>
                    <td className="p-2">
                      <Input 
                        type="number"
                        step="0.25"
                        min="0"
                        max="20"
                        {...control.register(`grades.${index}.value`)}
                        className="h-8"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={saveGradesMutation.isPending}>
                {saveGradesMutation.isPending ? 'Recording...': 'Record notes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}