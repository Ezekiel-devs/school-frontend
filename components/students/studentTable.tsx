'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Student } from '@/types/type';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Fonction de fetch pour les élèves
async function fetchStudents(): Promise<Student[]> {
  const { data } = await api.get('/student');
  return data;
}

export function StudentTable() {
  const {
    data: students,
    isLoading,
    isError,
    error,
  } = useQuery<Student[], Error>({
    queryKey: ['student'],
    queryFn: fetchStudents,
  });

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-6">
        <p>Chargement des élèves...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-6 text-center text-danger">
        <p>Erreur: {error.message}</p>
      </Card>
    );
  }

  return (
    <Card>
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left text-muted-foreground">
            <th className="p-4 font-medium">Matricule</th>
            <th className="p-4 font-medium">Nom Complet</th>
            <th className="p-4 font-medium">Genre</th>
            <th className="p-4 font-medium">Téléphone Parent</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students?.map((student) => (
            <tr key={student.id} className="border-b last:border-b-0 hover:bg-muted/50">
              <td className="p-4 font-mono text-xs">{student.matricule}</td>
              <td className="p-4 font-medium">{student.firstName} {student.lastName}</td>
              <td className="p-4 text-muted-foreground">{student.gender}</td>
              <td className="p-4 text-muted-foreground">{student.phoneParent}</td>
              <td className="p-4 text-right">
                <Button variant="outline" size="sm" className="mr-2">
                  Voir
                </Button>
                <Button variant="secondary" size="sm">
                  Modifier
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {students?.length === 0 && (
        <p className="p-6 text-center text-muted-foreground">
          Aucun élève trouvé.
        </p>
      )}
    </Card>
  );
}