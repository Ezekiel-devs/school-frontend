import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/pageHeader';
import { StudentTable } from '@/components/students/studentTable';

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Gestion des Élèves">
        <Link href="/students/create">
          <Button>Inscrire un élève</Button>
        </Link>
      </PageHeader>
      
      <StudentTable />
    </div>
  );
}