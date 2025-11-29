import { AcademicYearForm } from '@/components/academic-year/academicYearForm';
import { PageHeader } from '@/components/ui/pageHeader';

export default function CreateAcademicYearPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Create a new academic year" backLink="/academic-year" />
      <AcademicYearForm />
    </div>
  );
}