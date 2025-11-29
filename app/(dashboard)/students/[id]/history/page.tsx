'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Student } from '@/types/type';

import { EnrollmentHistoryTable } from '@/components/enrollments/enrollmentHistoryTable';
import { PageHeader } from '@/components/ui/pageHeader';
import { Loader2 } from 'lucide-react';

export default function StudentHistoryPage() {
  const params = useParams();
  const studentId = params.id as string;
  
  // On fetch les infos de l'élève pour afficher son nom dans le titre
  const { data: student, isLoading } = useQuery<Student>({
    queryKey: ['student', studentId],
    queryFn: async () => (await api.get(`/student/${studentId}`)).data,
    enabled: !!studentId,
  });

  if (isLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`History of ${student?.firstName || ''} ${student?.lastName || ''}`}
        backLink={`/students/${studentId}`}
        backLinkLabel="Back to students"
      />
      <EnrollmentHistoryTable studentId={studentId} />
    </div>
  );
}