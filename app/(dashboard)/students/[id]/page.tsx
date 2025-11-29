'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';

import { PageHeader } from '@/components/ui/pageHeader';
import { Loader2 } from 'lucide-react';
import type { Student } from '@/types/type';
import { Button } from '@/components/ui/button';
import { StudentForm } from '@/components/students/sudentForm';

export default function ViewStudentPage() {
  const params = useParams();
  const studentId = params.id as string;

  const { data: studentData, isLoading, isError } = useQuery<Student>({
    queryKey: ['student', studentId],
    queryFn: async () => (await api.get(`/student/${studentId}`)).data,
    enabled: !!studentId,
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError || !studentData) return <div className="text-red-500">Error: Student not found.</div>;
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Details of student"
        backLink="/students"
      >
        <div className="flex gap-2">
          {/* Lien vers la page d'historique */}
          <Link href={`/students/${studentId}/history`}>
            <Button variant="outline">View history</Button>
          </Link>
          {/* Lien vers la page d'inscription */}
          <Link href={`/students/${studentId}/enroll`}>
            <Button>Enroll in a class</Button>
          </Link>
        </div>
      </PageHeader>
      
      {/* On affiche les détails de l'élève avec le formulaire en lecture seule */}
      <StudentForm initialData={studentData} isReadOnly={true} />
    </div>
  );
}