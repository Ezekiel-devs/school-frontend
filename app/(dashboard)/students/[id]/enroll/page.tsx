'use client';

import { useParams } from 'next/navigation';
import { EnrollmentForm } from '@/components/enrollments/enrollmentForm';
import { PageHeader } from '@/components/ui/pageHeader';

export default function EnrollStudentPage() {
  const params = useParams();
  const studentId = params.id as string;

  return (
    <div className="space-y-6">
      <PageHeader
        title="New enrollment"
        backLink={`/students/${studentId}`}
        backLinkLabel="Back to student detail"
      />
      <EnrollmentForm studentId={studentId} />
    </div>
  );
}