import { StudentForm } from '@/components/students/sudentForm';
import { PageHeader } from '@/components/ui/pageHeader';

export default function CreateStudentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Enroll a new student"
        backLink="/students"
        backLinkLabel="Back to student list"
      />
      <StudentForm />
    </div>
  );
}