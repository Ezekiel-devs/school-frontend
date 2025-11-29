'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, Trash2, Loader2, Eye } from 'lucide-react';

import api from '@/lib/api';
import type { Classroom } from '@/types/type';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useAcademicYearStore } from '@/hooks/academicYearStore';

export function ClassroomTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { selectedYearId } = useAcademicYearStore();

  const { data: classrooms, isLoading, isError } = useQuery({
    queryKey: ['classrooms', selectedYearId, searchTerm],
    queryFn: async () => {
      const response = await api.get('/classroom', { 
        params: { search: searchTerm, }
    });
      return response.data as Classroom[];
    },
    enabled: !!selectedYearId,
  });

  

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/classroom/${id}`),
    onSuccess: () => {
      toast.success("Class deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
    },
    onError: (error) => toast.error("Deletion failed", { 
       // description: error.response?.data?.message 
    }),
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the class? "${name}" ?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-10 space-x-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading classes...</span>
      </Card>
    );
  }
  
  if (isError) return <Card className="p-6 text-center text-red-500 bg-red-50">Data loading error.</Card>;

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* EN-TÊTE DU TABLEAU */}
            <thead className="border-b">
              <tr className="text-left text-muted-foreground">
                <th className="p-4 font-medium w-[50px]">N°</th>
                <th className="p-4 font-medium">Nam of the Class</th>
                <th className="p-4 font-medium">Section</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            
            {/* CORPS DU TABLEAU */}
            <tbody>
              {classrooms && classrooms.length > 0 ? (
                classrooms.map((classroom, index) => (
                  <tr key={classroom.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-medium">
                      <Link 
                        href={`/classrooms/${classroom.id}`} 
                        className="hover:underline hover:text-primary transition-colors"
                      >
                        {classroom.name}
                      </Link>
                    </td>
                    <td className="p-4">
                      {/* Remplacement du composant Badge par un <span> stylisé */}
                      <span
                        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          classroom.section === 'ANGLOPHONE'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {classroom.section}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <Link href={`/classrooms/${classroom.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Manage
                          </Button>
                      </Link>
                      <Link href={`/classrooms/${classroom.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Modifier">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost" size="icon" title="Supprimer"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => handleDelete(classroom.id, classroom.name)}
                        disabled={deleteMutation.isPending && deleteMutation.variables === classroom.id}
                      >
                        {deleteMutation.isPending && deleteMutation.variables === classroom.id
                         ? <Loader2 className="h-4 w-4 animate-spin"/>
                         : <Trash2 className="h-4 w-4" />
                        }
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="h-24 text-center text-muted-foreground">
                    No classes found.
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