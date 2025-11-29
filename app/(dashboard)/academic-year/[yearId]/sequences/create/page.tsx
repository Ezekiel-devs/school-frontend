'use client';

import { useParams } from 'next/navigation';
import { SequenceForm } from '@/components/sequences/sequenceForm';
import { PageHeader } from '@/components/ui/pageHeader';

export default function CreateSequencePage() {
  const params = useParams();
  const yearId = params.yearId as string;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Create new sequence" 
        backLink={`/academic-year/${yearId}/sequences`} 
      />
      <SequenceForm yearId={yearId} />
    </div>
  );
}