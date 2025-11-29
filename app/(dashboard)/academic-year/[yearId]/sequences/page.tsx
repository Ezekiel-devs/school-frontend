'use client'; // On fait de cette page un composant client pour gérer l'ID de l'URL

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { AcademicYear } from '@/types/type';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/pageHeader';
import { SequenceTable } from '@/components/sequences/sequenceTable';
import { SkeletonTable } from '@/components/ui/skeletonTable';
import { Loader2 } from 'lucide-react';


export default function SequencesPage() {
  const params = useParams();
  const yearId = params.yearId as string;

  // On fetch les détails de l'année académique pour afficher son libellé dans le titre
  const { data: academicYear, isLoading: isLoadingYear } = useQuery<AcademicYear>({
    queryKey: ['academicYear', yearId],
    queryFn: async () => {
      const response = await api.get(`/year/${yearId}`);
      return response.data;
    },
    enabled: !!yearId,
  });

  if (isLoadingYear) {
    return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Sequence of the year ${academicYear?.label || '...'}`}
        backLink="/academic-year"
        backLinkLabel="Back to year"
      >
        {/* Le lien de création inclut l'ID de l'année */}
        <Link href={`/academic-year/${yearId}/sequences/create`}>
          <Button>Create a new sequence</Button>
        </Link>
      </PageHeader>
      
      {/* On passe l'ID de l'année au tableau pour qu'il puisse fetcher ses propres données */}
      <SequenceTable yearId={yearId} />
    </div>
  );
}