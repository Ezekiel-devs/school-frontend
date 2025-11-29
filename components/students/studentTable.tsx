'use client';

import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import api from '@/lib/api';
import { Student } from '@/types/type';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import Link from 'next/link';
import { Eye, Loader2, Pencil, Trash2 } from 'lucide-react';



// Fonction de fetch pour les élèves
/*async function fetchStudents(): Promise<Student[]> {
  const { data } = await api.get('/student');
  return data;
}*/

export function StudentTable() {
  //search student
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient()

    const fetchStudents = async (query: string) => {
    // On passe le terme de recherche comme paramètre à l'API
    const response = await api.get('/student', {
      params: { search: query },
    });
    return response.data as Student[];
  };

    //view students
  const {
    data: students,
    isLoading,
    isError,
    error,
  } = useQuery<Student[], Error>({
    queryKey: ['student', searchTerm],
    queryFn: () => fetchStudents(searchTerm)
  });

  // --- MUTATION (Suppression) ---
  const deleteMutation = useMutation({
    mutationFn: (studentId: string) => api.delete(`/student/${studentId}`),
    onSuccess: () => {
      toast.success("Student deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
    onError: (error) => {
      //const message = error.response?.data?.message || "Une erreur est survenue.";
      toast.error("Deletion failed", { 
        //description: message 
      });
    },
  });

   // NOUVELLE FONCTION pour gérer la suppression
  const handleDelete = (studentId: string, studentName: string) => {
    // 1. Affiche la boîte de dialogue de confirmation
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the student? "${studentName}" ? This action is irreversible.`
    );

    // 2. Si l'utilisateur clique sur "OK", la variable isConfirmed sera `true`
    if (isConfirmed) {
      deleteMutation.mutate(studentId);
    }
  };

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-6">
        <p>Loading students...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-6 text-center text-danger">
        <p>Error: {error.message}</p>
      </Card>
    );
  }



  return (

    <div className="space-y-4">
      <div className="max-w-sm">
        <Input
          placeholder="Rechercher par nom, matricule..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
    <Card>
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left text-muted-foreground">
            <th className="w-[50px]">N°</th>
            <th className="p-4 font-medium">Matricule</th>
            <th className="p-4 font-medium">Full Name</th>
            <th className="p-4 font-medium">Gender</th>
            <th className="p-4 font-medium">Phone Parent</th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students && students.length > 0 ? (
            students.map((student, index) => (
              <tr key={student.id} className="border-b last:border-b-0 hover:bg-muted/50">
                <td className="p-4 font-mono text-xs">{index + 1}</td>
                <td className="p-4 font-mono text-xs">{student.matricule}</td>
                <td className="p-4 font-medium">{student.firstName} {student.lastName}</td>
                <td className="p-4 text-muted-foreground">{student.gender}</td>
                <td className="p-4 text-muted-foreground">{student.phoneParent}</td>
                <td className="p-4 text-right">
                  {/* --- BOUTON VOIR --- */}
                  <Link href={`/students/${student.id}`}>
                    <Button variant="secondary" size="icon" title="View details">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  {/* --- BOUTON MODIFIER --- */}
                  <Link href={`/students/${student.id}/edit`}>
                    <Button variant="outline" size="icon" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  {/* ---- BLOC MODIFIÉ POUR LA SUPPRESSION ---- */}
                   <Button
                        variant="ghost"
                        size="icon"
                        title="Supprimer"
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending && deleteMutation.variables === student.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    No students found.
                  </td>
                </tr>
              )}
        </tbody>
      </table>
    </Card>
  </div>
  );
}