import { ClassroomForm } from '@/components/classrooms/classroomForm';
import { PageHeader } from '@/components/ui/pageHeader';

export default function CreateClassroomPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Create a new class" backLink="/classrooms" />
      <ClassroomForm />
    </div>
  );
}