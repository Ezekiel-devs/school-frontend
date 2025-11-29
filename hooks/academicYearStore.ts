import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // Pour sauvegarder le choix dans le localStorage

interface AcademicYearState {
  selectedYearId: string | null;
  setSelectedYearId: (yearId: string) => void;
}

export const useAcademicYearStore = create<AcademicYearState>()(
  persist(
    (set) => ({
      selectedYearId: null,
      setSelectedYearId: (yearId) => set({ selectedYearId: yearId }),
    }),
    {
      name: 'academic-year-storage', // Nom de la clé dans le localStorage
    }
  )
);