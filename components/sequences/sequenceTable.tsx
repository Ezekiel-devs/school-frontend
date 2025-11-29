'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

import api from '@/lib/api';
import type { Sequence } from '@/types/type';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import Link from 'next/link';
import { SkeletonTable } from '../ui/skeletonTable';

// Le tableau reçoit l'ID de l'année en prop
interface SequenceTableProps {
  yearId: string;
}

export function SequenceTable({ yearId }: SequenceTableProps) {
  const queryClient = useQueryClient();

  const { data: sequences, isLoading, isError } = useQuery({
    // La clé de requête inclut yearId pour être unique
    queryKey: ['sequences', yearId],
    queryFn: async () => {
      const response = await api.get(`/sequence/${yearId}`);
      return response.data as Sequence[];
    },
    // On s'assure que la requête ne part que si on a un yearId
    enabled: !!yearId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const deleteMutation = useMutation({
    // La suppression se fait par l'ID de la séquence, pas besoin de l'année ici
    mutationFn: (id: string) => api.delete(`/sequence/${id}`),
    onSuccess: () => {
      toast.success("Sequence Deleted.");
      queryClient.invalidateQueries({ queryKey: ['sequences', yearId] });
    },
    onError: (error) => toast.error("Deletion failed", { 
      //description: error.response?.data?.message 
    }),
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the sequence "${name}" ?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <SkeletonTable />;
  if (isError) return <div className="text-red-500">Error of loading.</div>;

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b">
              <th className="p-4 font-medium">Number</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sequences && sequences.length > 0 ? (
              sequences.map((sequence) => (
                <tr key={sequence.id} className="border-b last:border-b-0 hover:bg-muted/50">
                  <td className="p-4 font-medium">{sequence.number}</td>
                  <td className="p-4">{sequence.name}</td>
                  <td className="p-4 text-right space-x-1">
                    {/* Le lien de modification doit connaître l'année ET la séquence */}
                    <Link href={`/academic-year/${yearId}/sequences/${sequence.id}/edit`}>
                      <Button variant="ghost" size="icon" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost" size="icon" title="Supprimer"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(sequence.id, sequence.name)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="h-24 text-center text-muted-foreground">
                  Sequence not found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}