import { SubjectForm } from '@/components/subjects/subjectForm';
import { PageHeader } from '@/components/ui/pageHeader';

export default function CreateSubjectPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Create new subject" backLink="/subjects" />
      <SubjectForm />
    </div>
  );
}