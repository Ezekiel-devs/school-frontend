'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { Role } from '@/types/type';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/pageHeader';
import { StaffTable } from '@/components/staff/staffTable';
import { Card } from '@/components/ui/card';

export default function StaffPage() {
  const { data: session } = useSession();

  // La gestion des permissions reste au niveau de la page
  const canManageStaff =
    session?.user?.role === Role.ADMIN || session?.user?.role === Role.SUPER_ADMIN;

  if (!canManageStaff) {
    return (
      <Card>
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-danger">Accès Refusé</h2>
          <p className="mt-2 text-muted-foreground">
            Vous avez pas les permissions pour gérer le personnel.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Gestion du Personnel">
        <Link href="/staff/create">
          <Button>Ajouter un membre</Button>
        </Link>
      </PageHeader>
      
      <StaffTable />
    </div>
  );
}