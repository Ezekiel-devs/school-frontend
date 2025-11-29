import { StaffForm } from '@/components/staff/staffForm';
import { PageHeader } from '@/components/ui/pageHeader';

export default function CreateStaffPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add a member (Teacher)" backLink="/staff" />
      <StaffForm />
    </div>
  );
}