'use client';

import { useState } from 'react';
import { useAcademicYearStore } from '@/hooks/academicYearStore';
import { PageHeader } from '@/components/ui/pageHeader';
import { ReportCardList } from '@/components/reports/reportCardList';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Classroom, Sequence } from '@/types/type';

export default function ReportsPage() {
  const { selectedYearId } = useAcademicYearStore();

  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>('');

  // Queries pour les filtres
  /*const { data: classrooms, isLoading: isLoadingClasses } = useQuery<Classroom[]>({
    queryKey: ['classrooms', selectedYearId],
    queryFn: async () => (await api.get('/classroom', { params: { yearId: selectedYearId } })).data,
    enabled: !!selectedYearId,
    initialData: [],
  });*/
  const { data: classrooms, isLoading: isLoadingClasses, isError } = useQuery({
      queryKey: ['classrooms', selectedYearId],
      queryFn: async () => {
        const response = await api.get('/classroom', { 
          params: { yearId: selectedYearId }
      });
        return response.data as Classroom[];
      },
      enabled: !!selectedYearId,
    });
  const { data: sequences, isLoading: isLoadingSequences } = useQuery<Sequence[]>({
    queryKey: ['sequences', selectedYearId],
    //console.log(selectedYearId),
    queryFn: async () => (await api.get(`/sequence/${selectedYearId}`)).data,
    enabled: !!selectedYearId,

    initialData: [],
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  /*if (isSuccess) {
    console.log("[useQuery - Sequences] `sequences` variable in component:", sequences);
  }*/


  return (
    <div className="space-y-6">
      <PageHeader title="Génération des Bulletins" />
      
      {!selectedYearId ? (
        <p>Please select an academic year.</p>
      ) : (
        <div className="p-4 border rounded-lg space-y-4 bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select onChange={(e) => setSelectedClassId(e.target.value)} className="h-10 border p-2 rounded-md">
              <option value="">{isLoadingClasses ? 'Loading...' : 'Select a class'}</option>
              {classrooms?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select onChange={(e) => setSelectedSequenceId(e.target.value)} className="h-10 border p-2 rounded-md">
              <option value="">{isLoadingSequences ? 'Loading...' : 'Select a sequence'}</option>
              {sequences && sequences.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      )}

      {selectedClassId && selectedSequenceId ? (
        <ReportCardList 
          classId={selectedClassId}
          sequenceId={selectedSequenceId}
        />
      ) : (
        <div className="text-center text-muted-foreground pt-10">
          <p>Please select a class and a sequence to display the list of students.</p>
        </div>
      )}
    </div>
  );
}