'use client';

import { useSession, signOut } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAcademicYearStore } from '@/hooks/academicYearStore';
import api from '@/lib/api';
import type { AcademicYear } from '@/types/type';
import { useEffect } from 'react';

function AcademicYearSelector() {
  const { selectedYearId, setSelectedYearId } = useAcademicYearStore();

  // 2. Le useQuery est maintenant simplifié, sans onSuccess
  const { data: academicYears, isLoading } = useQuery<AcademicYear[]>({
    queryKey: ['academicYears'],
    queryFn: async () => (await api.get('/year')).data,
    staleTime: 1000 * 60 * 60, // Mettre en cache pour 1 heure
  });

  // 3. On utilise useEffect pour gérer l'effet de bord
  useEffect(() => {
    // On s'assure que les données sont bien chargées
    if (academicYears && academicYears.length > 0) {
      // Si aucune année n'est sélectionnée dans le store...
      if (!selectedYearId) {
        const currentYear = academicYears.find(y => y.isCurrent);
        if (currentYear) {
          setSelectedYearId(currentYear.id);
        } else {
          // Fallback : on sélectionne la première année de la liste
          setSelectedYearId(academicYears[0].id);
        }
      }
    }
  }, [academicYears, selectedYearId, setSelectedYearId]); // 4. Le tableau de dépendances

  const handleYearChange = (yearId: string) => {
    if (yearId) {
      setSelectedYearId(yearId);
      window.location.reload(); 
    }
  };
  
  if (isLoading) {
    return <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Chargement...</div>;
  }

  return (
    <select
      value={selectedYearId ?? ''}
      onChange={(e) => handleYearChange(e.target.value)}
      className="h-9 w-[180px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
    >
      {academicYears?.map(year => (
        <option key={year.id} value={year.id}>
          {year.label} {year.isCurrent ? ' (Actuelle)' : ''}
        </option>
      ))}
    </select>
  );
}



export function Navbar() {
  const { data: session } = useSession();

  // On attend que la session soit chargée pour éviter un affichage partiel
  if (!session) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b bg-background px-6">
        <Loader2 className="h-5 w-5 animate-spin" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
      {/* Côté gauche : le sélecteur d'année */}
      <div className="flex items-center gap-4">
        <AcademicYearSelector />
      </div>

      {/* Côté droit : les infos utilisateur et déconnexion */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">
            {session.user.firstName} {session.user.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{session.user.role}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          LogOut
        </Button>
      </div>
    </header>
  );
}