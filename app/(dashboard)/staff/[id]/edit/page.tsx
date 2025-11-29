'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

import { StaffForm } from '@/components/staff/staffForm';
import { PageHeader } from '@/components/ui/pageHeader';
import { Loader2 } from 'lucide-react';
import type { Staff } from '@/types/type';

export default function EditStaffPage() {
  const params = useParams();
  const id = params.id as string | undefined;

  const { data, isLoading, isError } = useQuery<Staff>({
    queryKey: ['staff-member', id], // Clé différente pour ne pas confondre avec la liste
    queryFn: async () => {
      const response = await api.get(`/staff/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (isError || !data) return <div className="text-red-500">Error: Member not found.</div>;

  return (
    <div className="space-y-6">
      <PageHeader title={`Modifier ${data.firstName} ${data.lastName}`} backLink="/staff" />
      <StaffForm initialData={data} />
    </div>
  );
}