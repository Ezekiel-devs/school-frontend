'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

import api from '@/lib/api';
import type { Subject } from '@/types/type'; // Assurez-vous d'avoir le type Subject
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SkeletonTable } from '../ui/skeletonTable';
import { Card } from '../ui/card';

export function SubjectTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: subjects, isLoading, isError } = useQuery({
    queryKey: ['subjects', searchTerm],
    queryFn: async () => {
      const response = await api.get('/subject', { params: { search: searchTerm } });
      return response.data as Subject[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/subject/${id}`),
    onSuccess: () => {
      toast.success("Subject deleted sucessfully");
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
    onError: (error) => toast.error("Deletion failed", { 
        //description: error.response?.data?.message 
    }),
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the subject? "${name}" ?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <SkeletonTable />;
  if (isError) return <div className="text-red-500">Loading error.</div>;

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <Input
          placeholder="search by name or by code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="p-4 font-medium w-[50px]">N°</th>
                <th className="p-4 font-medium">Subject label</th>
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Credits</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects && subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <tr key={subject.id} className="border-b last:border-b-0 hover:bg-muted/50">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium">{subject.name}</td>
                    <td className="p-4 text-muted-foreground">{subject.code}</td>
                    <td className="p-4 text-muted-foreground">{subject.credit}</td>
                    <td className="p-4 text-right space-x-1">
                      <Link href={`/subjects/${subject.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost" size="icon" title="Delete"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(subject.id, subject.name)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="h-24 text-center text-muted-foreground">
                    No subject found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}