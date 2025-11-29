import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/pageHeader';
import { ClassroomTable } from '@/components/classrooms/classroomTable';
import { SkeletonTable } from '@/components/ui/skeletonTable';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Server Component pour la sécurité
export default async function ClassroomsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  
  return (
    <div className="space-y-6">
      <PageHeader title="Class Management">
        <Link href="/classrooms/create">
          <Button>Create a class</Button>
        </Link>
      </PageHeader>
      
      <Suspense fallback={<SkeletonTable />}>
        <ClassroomTable />
      </Suspense>
    </div>
  );
}