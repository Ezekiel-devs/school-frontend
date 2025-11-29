'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Pencil, Trash2, Loader2 } from 'lucide-react';

import api from '@/lib/api';
import type { Staff } from '@/types/type';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function StaffTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: staffList, isLoading, isError, error } = useQuery<Staff[], Error>({
    queryKey: ['staff', searchTerm],
    queryFn: async () => {
      const response = await api.get('/staff', { params: { search: searchTerm } });
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/staff/${id}`),
    onSuccess: () => {
      toast.success("Staff member removed.");
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
    onError: (error) => toast.error("Deletion failed", { 
      //description: error.response?.data?.message 
    }),
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" ?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-10 space-x-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Staff loading...</span>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-6 text-center text-red-500 bg-red-50 border-red-200">
        <p className="font-semibold">Error: {error.message}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* --- RECHERCHE --- */}
      <div className="max-w-sm">
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- TABLEAU --- */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-muted-foreground">
                <th className="p-4 font-medium w-[50px]">N°</th>
                <th className="p-4 font-medium">Full name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList?.map((staff, index) => (
                <tr key={staff.id} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium">{staff.firstName} {staff.lastName}</td>
                  <td className="p-4 text-muted-foreground">{staff.email}</td>
                  <td className="p-4">
                    {/* Badge pour le Rôle */}
                    <span className="rounded-full bg-secondary/50 px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                      {staff.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {/* Badge pour le Statut (Actif/Inactif) */}
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      staff.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                    }`}>
                      {staff.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    {/* Actions : Modifier et Supprimer */}
                    <Link href={`/staff/${staff.id}/edit`}>
                      <Button variant="ghost" size="icon" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost" size="icon" title="Delete"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleDelete(staff.id, `${staff.firstName} ${staff.lastName}`)}
                      disabled={deleteMutation.isPending && deleteMutation.variables === staff.id}
                    >
                       {deleteMutation.isPending && deleteMutation.variables === staff.id
                         ? <Loader2 className="h-4 w-4 animate-spin"/>
                         : <Trash2 className="h-4 w-4" />
                        }
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Message si le tableau est vide */}
          {staffList?.length === 0 && (
            <p className="p-6 text-center text-muted-foreground">
              No staff members found.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}