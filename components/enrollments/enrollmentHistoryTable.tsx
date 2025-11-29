'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import type { Enrollment } from '@/types/type'; // Ce type doit inclure les relations
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EnrollmentHistoryTableProps {
  studentId: string;
}

export function EnrollmentHistoryTable({ studentId }: EnrollmentHistoryTableProps) {
  const queryClient = useQueryClient();

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['enrollments', studentId],
    queryFn: async () => {
      const response = await api.get(`/student/${studentId}/enrollments`);
      // L'API doit renvoyer les données avec les relations classroom et year
      return response.data as Enrollment[];
    },
    enabled: !!studentId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/enrollment/${id}`),
    onSuccess: () => {
      toast.success("Enrollment delated.");
      queryClient.invalidateQueries({ queryKey: ['enrollments', studentId] });
    },
    onError: (error) => toast.error("Échec", { 
        //description: error.response?.data?.message 
    }),
  });
  
  if (isLoading) return <div>Loading history...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>History of enrollment</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Academic year</th>
              <th className="p-2">Class</th>
              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {enrollments && enrollments.length > 0 ? (
              enrollments.map(enroll => (
                <tr key={enroll.id} className="border-b last:border-b-0">
                  <td className="p-2">{enroll.year?.label}</td>
                  <td className="p-2">{enroll.classroom?.name}</td>
                  <td className="p-2 text-right">
                    <Link href={`/students/${studentId}/enroll/${enroll.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Edit enrollment">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>

                    <Button
                      variant="ghost" size="icon" title="Unenrolled"
                      className="text-red-500"
                      onClick={() => {
                          if(window.confirm(`Unsubscribe from the class ${enroll.classroom?.name} for the year ${enroll.year?.label} ?`)) {
                              deleteMutation.mutate(enroll.id)
                          }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="text-center p-4">No registration found.</td></tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}