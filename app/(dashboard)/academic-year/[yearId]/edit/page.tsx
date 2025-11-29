'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

import { AcademicYearForm } from '@/components/academic-year/academicYearForm';
import { PageHeader } from '@/components/ui/pageHeader';
import { Loader2 } from 'lucide-react';
import type { AcademicYear } from '@/types/type';

export default function EditAcademicYearPage() {
  const params = useParams();
  const yearId = params.yearId as string | undefined;
  console.log(yearId)

  const { data, isLoading, isError } = useQuery<AcademicYear>({
    queryKey: ['academicYear', yearId],
    queryFn: async () => {
        console.log(`queryfn`, yearId)
      const response = await api.get(`/year/${yearId}`);
      return response.data;
    },
    enabled: !!yearId,
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError || !data) return <div className="text-red-500">Error: Year not found.</div>;

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit year ${data.label}`} backLink="/academic-year" />
      <AcademicYearForm initialData={data} />
    </div>
  );
}