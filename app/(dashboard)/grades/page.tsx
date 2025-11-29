'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAcademicYearStore } from '@/hooks/academicYearStore';

import { PageHeader } from '@/components/ui/pageHeader';
import { GradeEntryTable } from '@/components/grades/gradeEntryTable';
import type { Classroom, Subject, Sequence } from '@/types/type';
import { Loader2 } from 'lucide-react';

export default function GradeEntryPage() {
  const { data: session } = useSession();
  const { selectedYearId } = useAcademicYearStore();

  // États pour les sélections de l'utilisateur
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>('');

  const staffId = session?.user?.id;

  // --- QUERIES POUR LES LISTES DÉROULANTES ---
  /*const { data: classes, isLoading: isLoadingClasses } = useQuery<Classroom[]>({
    queryKey: ['my-classes', staffId, selectedYearId],
    queryFn: async () => (await api.get(`/staff/${staffId}/classes`, { params: { yearId: selectedYearId } })).data,
    enabled: !!staffId && !!selectedYearId,
  });*/

  const { data: classes, isLoading: isLoadingClasses } = useQuery<Classroom[]>({
    queryKey: ['my-classes', selectedYearId],
    queryFn: async () => (await api.get(`/classroom`)).data,
    enabled: !!selectedYearId,
  });

  /*const { data: subjects, isLoading: isLoadingSubjects } = useQuery<Subject[]>({
    queryKey: ['my-subjects', staffId, selectedClassId],
    queryFn: async () => (await api.get(`/staff/${staffId}/subjects`, { params: { yearId: selectedYearId, classId: selectedClassId } })).data,
    enabled: !!staffId && !!selectedClassId,
  });*/

  const { data: subjects, isLoading: isLoadingSubjects } = useQuery<Classroom[]>({
    queryKey: ['my-subjects', selectedYearId],
    queryFn: async () => (await api.get(`/subject`)).data,
    enabled: !!selectedYearId,
  });

  const { data: sequences, isLoading: isLoadingSequences } = useQuery<Sequence[]>({
    queryKey: ['sequences', selectedYearId],
    //queryFn: async () => (await api.get(`/year/${selectedYearId}/sequence`)).data,
    queryFn: async () => (await api.get(`/sequence/${selectedYearId}`)).data,
    enabled: !!selectedYearId,
    initialData: [],
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const allFiltersSelected = selectedClassId && selectedSubjectId && selectedSequenceId;

  return (
    <div className="space-y-6">
      <PageHeader title="Saisie des Notes" />
      
      {!selectedYearId ? (
        <p className="text-muted-foreground">Please select an academic year from the navigation bar.</p>
      ) : (
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-semibold">Please make your selections</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sélecteur de Classe */}
            <select onChange={(e) => { setSelectedClassId(e.target.value); setSelectedSubjectId(''); }} className="h-10 border p-2 rounded-md">
              <option value="">{isLoadingClasses ? 'Loading...' : 'Select a class'}</option>
              {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {/* Sélecteur de Matière */}
            <select onChange={(e) => setSelectedSubjectId(e.target.value)} disabled={!selectedClassId} className="h-10 border p-2 rounded-md">
              <option value="">{isLoadingSubjects ? 'Loading...' : 'Select a course'}</option>
              {subjects?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {/* Sélecteur de Séquence */}
            <select onChange={(e) => setSelectedSequenceId(e.target.value)} className="h-10 border p-2 rounded-md">
              <option value="">{isLoadingSequences ? 'Loading...' : 'Select a sequence'}</option>
              {sequences?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Le tableau de saisie n'apparaît que si tout est sélectionné */}
      {allFiltersSelected ? (
        <GradeEntryTable 
          classId={selectedClassId}
          subjectId={selectedSubjectId}
          sequenceId={selectedSequenceId}
        />
      ) : (
        <div className="text-center text-muted-foreground pt-10">
          <p>Please select a class, subject, and sequence to begin..</p>
        </div>
      )}
    </div>
  );
}