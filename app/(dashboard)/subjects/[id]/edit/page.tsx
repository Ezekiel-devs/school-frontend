'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

import { SubjectForm } from '@/components/subjects/subjectForm';
import { PageHeader } from '@/components/ui/pageHeader';
import { Loader2 } from 'lucide-react';
import type { Subject } from '@/types/type';

export default function EditSubjectPage() {
  const params = useParams();
  const id = params.id as string | undefined;

  const { data, isLoading, isError } = useQuery<Subject>({
    queryKey: ['subject', id],
    queryFn: async () => {
      const response = await api.get(`/subject/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError || !data) return <div className="text-red-500">Error: Course not found.</div>;

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit course ${data.name}`} backLink="/subjects" />
      <SubjectForm initialData={data} />
    </div>
  );
}