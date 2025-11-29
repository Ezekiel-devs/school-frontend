'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

import { ClassroomForm } from '@/components/classrooms/classroomForm';
import { PageHeader } from '@/components/ui/pageHeader';
import { Loader2 } from 'lucide-react';
import type { Classroom } from '@/types/type';

export default function EditClassroomPage() {
  const params = useParams();
  const classroomId = params.id as string | undefined;

  const { data, isLoading, isError } = useQuery<Classroom>({
    queryKey: ['classroom', classroomId],
    queryFn: async () => {
      const response = await api.get(`/classroom/${classroomId}`);
      return response.data;
    },
    enabled: !!classroomId,
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError || !data) return <div className="text-red-500">Error: Class not found.</div>;

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit class ${data.name}`} backLink="/classrooms" />
      <ClassroomForm initialData={data} />
    </div>
  );
}