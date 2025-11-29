'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Printer } from 'lucide-react';
import { SkeletonTable } from '../ui/skeletonTable';
import { toast } from 'sonner';

// Type pour les données agrégées du bulletin
interface ReportCardSummary {
  studentId: string;
  firstName: string;
  lastName: string;
  average: number | null;
  rank: number | null;
}

interface ReportCardListProps {
  classId: string;
  sequenceId: string;
}

const handlePrint = (studentId: string, sequenceId: string) => {
    if (!sequenceId) {
    toast.error("Please select a sequence.");
    return;
  }
  // On utilise l'instance 'api' qui est déjà configurée avec `withCredentials: true` (si nécessaire)
  // et qui gère correctement l'authentification.
  api.get(`report/student/${studentId}/pdf?sequenceId=${sequenceId}`, {
    responseType: 'blob', // Important: on demande des données binaires
  })
  .then(response => {
    // Créer une URL à partir du blob PDF reçu
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    // Ouvrir cette URL dans un nouvel onglet
    window.open(fileURL, '_blank');
  })
  .catch(error => {
    toast.error("Error generating PDF.");
    console.error("PDF Generation Error:", error);
  });
};

export function ReportCardList({ classId, sequenceId }: ReportCardListProps) {
  const { data: summaries, isLoading } = useQuery<ReportCardSummary[]>({
    queryKey: ['report-card-summaries', classId, sequenceId],
    queryFn: async () => {
      const response = await api.get('/report/report-cards', { 
        params: { classId, sequenceId } 
      });
      return response.data;
    },
    enabled: !!classId && !!sequenceId,
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';


  if (isLoading) return <SkeletonTable />;

  return (
    <Card>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">N°</th>
            <th className="p-2">Name of student</th>
            <th className="p-2">Grade / 20</th>
            <th className="p-2">Rank</th>
            <th className="p-2 text-right">Transcript</th>
          </tr>
        </thead>
        <tbody>
          {summaries?.map((summary, index) => (
            <tr key={summary.studentId} className="border-b">
              <td className="p-2">{index + 1}</td>
              <td className="p-2 font-medium">{summary.firstName} {summary.lastName}</td>
              <td className="p-2">{summary.average?.toFixed(2) ?? 'N/A'}</td>
              <td className="p-2">{summary.rank ?? 'N/A'}</td>
              <td className="p-2 text-right">
                {/* On ouvre le bulletin dans un nouvel onglet */}
                {/*<a 
                  href={`${apiUrl}/student/${summary.studentId}/pdf?sequenceId=${sequenceId}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                >*/}
                <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handlePrint(summary.studentId, sequenceId)}
                  >
                  {/*<Button variant="ghost" size="icon">*/}
                    <Printer className="h-4 w-4" />
                  </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}