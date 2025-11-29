import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/pageHeader';
import { StudentTable } from '@/components/students/studentTable';
import { SkeletonTable } from '@/components/ui/skeletonTable';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function StudentsPage() {
  const session = await getServerSession(authOptions);

  // 2. Sécuriser la route
  if (!session || !session.backendToken) {
    redirect("/login");
  }
  
  return (
    <div className="space-y-6">
      <PageHeader title="Manage student">
        <Link href="/students/create">
          <Button>Enroll a student</Button>
        </Link>
      </PageHeader>
      
      <Suspense fallback={<SkeletonTable />}>
        {/* 3. On passe les données initiales au Client Component. */}
        <StudentTable />
      </Suspense>
    </div>
  );
}




