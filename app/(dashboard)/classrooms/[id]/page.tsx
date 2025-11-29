'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Classroom } from '@/types/type';
import Link from 'next/link'; // Importez Link

import { PageHeader } from '@/components/ui/pageHeader';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Le composant TeachingsTable ne change pas
import { TeachingsTable } from '@/components/teach/teachingTable';

export default function ClassroomDetailsPage() {
  const params = useParams();
  const classroomId = params.id as string;
  
  // Le fetch de la classe reste le même
  const { data: classroom, isLoading } = useQuery<Classroom>({
    queryKey: ['classroom', classroomId],
    queryFn: async () => (await api.get(`/classroom/${classroomId}`)).data,
    enabled: !!classroomId,
  });

  if (isLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  }
  if (!classroom) {
    return <div>Classe not found.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Manage class : ${classroom.name}`}
        backLink="/classrooms"
        backLinkLabel="Back to class"
      >
        {/* On remplace le bouton onClick par un Link */}
        <Link href={`/classrooms/${classroomId}/assign`}>
          <Button>Assign a teacher</Button>
        </Link>
      </PageHeader>
      
      {/* Le tableau des affectations reste ici */}
      <TeachingsTable classroomId={classroomId} />
    </div>
  );
}