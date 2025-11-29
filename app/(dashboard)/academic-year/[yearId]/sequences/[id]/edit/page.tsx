'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

import { SequenceForm } from '@/components/sequences/sequenceForm';
import { PageHeader } from '@/components/ui/pageHeader';
import { Loader2 } from 'lucide-react';
import type { Sequence } from '@/types/type';

export default function EditSequencePage() {
  const params = useParams();
  const id = params.id as string;
  const yearId = params.yearId as string;

  const { data, isLoading, isError } = useQuery<Sequence>({
    queryKey: ['sequence', id],
    queryFn: async () => {
      const response = await api.get(`/sequence/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError || !data) return <div className="text-red-500">Error: Sequence not found.</div>;

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Edit sequence ${data.name}`} 
        backLink={`/academic-year/${yearId}/sequences`} 
      />
      <SequenceForm initialData={data} yearId={yearId} />
    </div>
  );
}