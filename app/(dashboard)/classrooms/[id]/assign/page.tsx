'use client';

import { useParams } from 'next/navigation';
import { AssignTeacherForm } from '@/components/teach/assignTeachForm';
import { PageHeader } from '@/components/ui/pageHeader';

export default function AssignTeacherPage() {
  const params = useParams();
  const classroomId = params.id as string;

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Assignment"
        backLink={`/classrooms/${classroomId}`}
        backLinkLabel="Back to class detail"
      />
      <AssignTeacherForm classroomId={classroomId} />
    </div>
  );
}