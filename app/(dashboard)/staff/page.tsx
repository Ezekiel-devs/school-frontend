'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { Role } from '@/types/type';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/pageHeader';
import { StaffTable } from '@/components/staff/staffTable';
import { Card } from '@/components/ui/card';
import { Suspense } from 'react';
import { SkeletonTable } from '@/components/ui/skeletonTable';

export default function StaffPage() {
  const { data: session } = useSession();

  // La gestion des permissions reste au niveau de la page
  const canManageStaff =
    session?.user?.role === Role.ADMIN || session?.user?.role === Role.SUPER_ADMIN;

  if (!canManageStaff) {
    return (
      <Card>
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-danger">Access denied</h2>
          <p className="mt-2 text-muted-foreground">
            You do not have permission to manage staff.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Personnel Management">
        <Link href="/staff/create">
          <Button>Add a member</Button>
        </Link>
      </PageHeader>
      
      <Suspense fallback={<SkeletonTable />}>
        <StaffTable />
      </Suspense>
    </div>
  );
}