'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Teach } from '@/types/type'; // Doit inclure les relations `subject` et `staff`
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TeachingsTableProps {
  classroomId: string;
}

export function TeachingsTable({ classroomId }: TeachingsTableProps) {
  const queryClient = useQueryClient();

  // Fetch des affectations pour cette classe
  const { data: teachings, isLoading } = useQuery<Teach[]>({
    queryKey: ['teachings', classroomId],
    queryFn: async () => {
      const response = await api.get(`/classroom/${classroomId}/teach`);
      return response.data;
    },
    enabled: !!classroomId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/teach/${id}`),
    onSuccess: () => {
      toast.success("Affectation supprimée.");
      queryClient.invalidateQueries({ queryKey: ['teachings', classroomId] });
    },
    onError: (error) => toast.error("Échec", { 
        //description: error.response?.data?.message 
    }),
  });

  if (isLoading) return <div>Loading assignments...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subjects and Teachers Assigned</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Course</th>
              <th className="p-2">Teacher</th>
              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {teachings && teachings.length > 0 ? (
              teachings.map(teach => (
                <tr key={teach.id} className="border-b last:border-b-0">
                  <td className="p-2 font-medium">{teach.subject?.name}</td>
                  <td className="p-2">{teach.staff?.firstName} {teach.staff?.lastName}</td>
                  <td className="p-2 text-right">
                    <Button
                      variant="ghost" size="icon" title="Retirer l'affectation"
                      className="text-red-500"
                      onClick={() => {
                        if(window.confirm(`Remove ${teach.staff?.firstName} of the course ${teach.subject?.name} ?`)) {
                          deleteMutation.mutate(teach.id)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="text-center p-4">No assignments for this class.</td></tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}