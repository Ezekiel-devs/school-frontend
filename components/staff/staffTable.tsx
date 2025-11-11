'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Staff } from '@/types/type';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// La fonction de fetch reste la même
async function fetchStaff(): Promise<Staff[]> {
  const { data } = await api.get('/staff');
  return data;
}

export function StaffTable() {
  const {
    data: staffList,
    isLoading,
    isError,
    error,
  } = useQuery<Staff[], Error>({
    queryKey: ['staff'],
    queryFn: fetchStaff,
  });

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-6">
        <p>Chargement du personnel...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-6">
        <p className="text-center text-danger">Erreur: {error.message}</p>
      </Card>
    );
  }

  return (
    <Card>
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left text-muted-foreground">
            <th className="p-4 font-medium">Nom Complet</th>
            <th className="p-4 font-medium">Email</th>
            <th className="p-4 font-medium">Rôle</th>
            <th className="p-4 font-medium">Statut</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList?.map((staff) => (
            <tr key={staff.id} className="border-b last:border-b-0 hover:bg-muted/50">
              <td className="p-4 font-medium">{staff.firstName} {staff.lastName}</td>
              <td className="p-4 text-muted-foreground">{staff.email}</td>
              <td className="p-4">
                <span className="rounded-full bg-secondary/20 px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                  {staff.role}
                </span>
              </td>
              <td className="p-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  staff.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                }`}>
                  {staff.isActive ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td className="p-4 text-right">
                {/* Liens vers les pages d'édition/détails */}
                <Button variant="outline" size="sm">
                  Modifier
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {staffList?.length === 0 && (
        <p className="p-6 text-center text-muted-foreground">
          Aucun membre du personnel trouvé.
        </p>
      )}
    </Card>
  );
}