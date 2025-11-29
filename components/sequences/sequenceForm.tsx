'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { sequenceSchema, SequenceFormData } from '@/schemas/sequence';
import type { Sequence } from '@/types/type';
import api, { isAxiosError } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface SequenceFormProps {
  initialData?: Sequence;
  yearId: string; 
}

export function SequenceForm({ initialData, yearId }: SequenceFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SequenceFormData>({
    resolver: zodResolver(sequenceSchema),
    defaultValues: {
      name: initialData?.name || '',
      number: initialData?.number ? String(initialData.number) : '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: Omit<SequenceFormData, 'number'> & { number: number }) => {
      const url = isEditMode 
        ? `/sequence/${initialData?.id}` // Pour la mise à jour, on cible la séquence
        : `/sequence/${yearId}/sequence`; // Pour la création, on cible la collection sous l'année
      const method = isEditMode ? 'put' : 'post';
      return api[method](url, data);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Sequence updated !" : "Sequence created !");
      queryClient.invalidateQueries({ queryKey: ['sequences', yearId] });
      router.push(`/academic-year/${yearId}/sequences`); // Retourne à la liste des séquences de l'année
    },
    /*onError: (error) => toast.error("Échec", { 
        //description: error.response?.data?.message
     }),*/
     onError: (error: unknown) => { // On type d'abord en `unknown`, le type le plus sûr.
        let errorMessage = "An unexpected error has occurred.";
  
        // On vérifie si c'est bien une erreur Axios
        if (isAxiosError(error)) {
          // À l'intérieur de ce `if`, TypeScript sait que `error` est une AxiosError.
          // On vérifie aussi si `error.response.data.message` existe.
          if (error.response?.data && typeof error.response.data.message === 'string') {
            errorMessage = error.response.data.message;
          }
        } else if (error instanceof Error) {
          // Si c'est une erreur standard de JavaScript
          errorMessage = error.message;
        }
        
        toast.error("Operation Failed", { 
          description: errorMessage 
        });
      }
  });

  const onSubmit = (data: SequenceFormData) => {
     const dataToSend = {
      ...data,
      number: Number(data.number), // On convertit la chaîne en nombre
    };
    mutation.mutate(dataToSend);
  }

  return (
    <Card className="max-w-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Sequence" : "Create new sequence"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name sequence</Label>
            <Input id="name" {...register('name')} disabled={isSubmitting} placeholder="Eg: First sequence" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="number">Number (1 to 6)</Label>
            <Input id="number" type="number" {...register('number')} disabled={isSubmitting} />
            {errors.number && <p className="text-sm text-red-500">{errors.number.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '...' : isEditMode ? 'Update' : 'Create'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}