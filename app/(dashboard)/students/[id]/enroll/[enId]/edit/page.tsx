'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

import { EnrollmentForm } from '@/components/enrollments/enrollmentForm';
import { PageHeader } from '@/components/ui/pageHeader';
import { Loader2 } from 'lucide-react';
import type { Enrollment } from '@/types/type';

export default function EditEnrollmentPage() {
  const params = useParams();
  const studentId = params.id as string;
  const enrollmentId = params.enId as string;

  // Fetch des données de l'inscription à modifier
  const { data, isLoading, isError } = useQuery<Enrollment>({
    queryKey: ['enrollment', enrollmentId],
    queryFn: async () => (await api.get(`/enrollment/${enrollmentId}`)).data,
    enabled: !!enrollmentId,
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  if (isError || !data) return <div>Error: Enrollment non found.</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit an enrollment"
        backLink={`/students/${studentId}/history`}
        backLinkLabel="Back to history"
      />
      <EnrollmentForm studentId={studentId} initialData={data} />
    </div>
  );
}