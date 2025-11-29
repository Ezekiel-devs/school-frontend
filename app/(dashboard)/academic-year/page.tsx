import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/pageHeader';
import { AcademicYearTable } from '@/components/academic-year/academicYearTable'; // On va créer ce composant
import { SkeletonTable } from '@/components/ui/skeletonTable';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AcademicYearsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  
  return (
    <div className="space-y-6">
      <PageHeader title="Academic year management">
        <Link href="/academic-year/create">
          <Button>Create a Year</Button>
        </Link>
      </PageHeader>
      
      <Suspense fallback={<SkeletonTable />}>
        <AcademicYearTable />
      </Suspense>
    </div>
  );
}