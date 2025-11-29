'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CheckCircle2, ListOrdered, Pencil, Trash2 } from 'lucide-react';

import api, { isAxiosError } from '@/lib/api';
import type { AcademicYear } from '@/types/type';
import { Button } from '@/components/ui/button';
import { SkeletonTable } from '../ui/skeletonTable';
import { Card } from '../ui/card';

export function AcademicYearTable() {
  const queryClient = useQueryClient();

  const { data: academicYears, isLoading, isError } = useQuery({
    queryKey: ['academicYears'],
    queryFn: async () => {
      const response = await api.get('/year');
      return response.data as AcademicYear[];
    },
  });


  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/year/${id}`),
    onSuccess: () => {
      toast.success("Academic year deleted.");
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
    },
    onError: (error) => toast.error("Deletion failed!", { 
        //description: error.response?.data?.message 
    }),
  });
  
  const setCurrentMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/year/${id}/set-current`, {}),
    onSuccess: () => {
      toast.success("Current year updated.");
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
    },
    /*onError: (error) => toast.error("Échec de l'opération", { 
        //description: error.response?.data?.message 
    }),*/
    onError: (error: unknown) => { // On type d'abord en `unknown`, le type le plus sûr.
          let errorMessage = "Une erreur inattendue est survenue.";
    
          // On vérifie si c'est bien une erreur Axios
          if (isAxiosError(error)) {
            // À l'intérieur de ce `if`, TypeScript sait que `error` est une AxiosError.
            // On vérifie aussi si `error.response.data.message` existe.
            if (error.response?.data && typeof error.response.data.message === 'string') {
              errorMessage = error.response.data.message;
            }
          } else if (error instanceof Error) {
            // Si c'est une erreur standard de JavaScript
            errorMessage = error.message;
          }
          
          toast.error("Operation Failed", { 
            description: errorMessage 
          });
        }
  });


  const handleDelete = (id: string, label: string) => {
    if (window.confirm(`Are you sure you want to delete the year"${label}" ?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <SkeletonTable />;
  if (isError) return <div className="text-red-500">Loading error.</div>;

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b">
              <th className="p-4 font-medium w-[50px]">N°</th>
              <th className="p-4 font-medium">Label</th>
              <th className="p-4 font-medium">Statut</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {academicYears && academicYears.length > 0 ? (
              academicYears.map((year, index) => (
                <tr key={year.id} className="border-b last:border-b-0 hover:bg-muted/50">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium">{year.label}</td>
                  <td className="p-4">
                    {year.isCurrent && (
                      <span className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="h-5 w-5" />
                        Current
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <Link href={`/academic-year/${year.id}/sequences`}>
                      <Button variant="outline" size="sm">
                        <ListOrdered className="h-4 w-4 mr-2" />
                          Sequences
                      </Button>
                    </Link>
                    {!year.isCurrent && (
                       <Button 
                         variant="outline" 
                         size="sm"
                         onClick={() => setCurrentMutation.mutate(year.id)}
                         disabled={setCurrentMutation.isPending}
                       >
                         Set as current
                       </Button>
                    )}
                    <Link href={`/academic-year/${year.id}/edit`}>
                      <Button variant="ghost" size="icon" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost" size="icon" title="Delete"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(year.id, year.label)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="h-24 text-center text-muted-foreground">
                  No academic year found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}