'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

import { StudentForm } from '@/components/students/sudentForm';
import { PageHeader } from '@/components/ui/pageHeader';
import { Loader2 } from 'lucide-react';
import type { Student } from '@/types/type';

export default function EditStudentPage() {
  const params = useParams();
  const studentId = params.id as string | undefined;


  const { data: studentData, isLoading, isError } = useQuery<Student>({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const response = await api.get(`/student/${studentId}`);
      return response.data;
    },
    enabled: !!studentId,
  });

  // ---- LOGIQUE DE RENDU CORRIGÉE ----

  // Cas 1 : On est en train de charger (soit parce qu'on attend l'ID, soit parce que la requête est en cours)
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading..."
          backLink="/students"
          backLinkLabel="Back to list"
        />
        <div className="flex items-center justify-center p-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Cas 2 : Une erreur est survenue pendant le fetch
  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Error"
          backLink="/students"
          backLinkLabel="Back to list"
        />
        <div className="text-red-500">Error: Unable to load student data.</div>
      </div>
    );
  }

  // Cas 3 : Tout s'est bien passé, on a les données
  // (on vérifie aussi que studentData existe, par sécurité)
  if (studentData) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`Edit ${studentData.firstName} ${studentData.lastName}`}
          backLink="/students"
          backLinkLabel="Back to list"
        />
        <StudentForm initialData={studentData} />
      </div>
    );
  }

  // Cas par défaut (ne devrait pas arriver si la logique est bonne, mais c'est une sécurité)
  return null;
}