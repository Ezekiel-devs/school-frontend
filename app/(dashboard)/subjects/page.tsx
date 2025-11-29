import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/pageHeader';
import { SubjectTable } from '@/components/subjects/subjectTable'; 
import { SkeletonTable } from '@/components/ui/skeletonTable';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Server Component pour la sécurité
export default async function SubjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  
  return (
    <div className="space-y-6">
      <PageHeader title="Manage subject">
        <Link href="/subjects/create">
          <Button>Create a subject</Button>
        </Link>
      </PageHeader>
      
      <Suspense fallback={<SkeletonTable />}>
        <SubjectTable />
      </Suspense>
    </div>
  );
}