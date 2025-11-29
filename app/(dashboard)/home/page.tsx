import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Use the navigation on the left to manage students, staff, classes and more.
        </p>
      </Card>
      
      {/* Ici, vous pourrez ajouter des cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="p-4">
            <h3 className="font-semibold">Registered Students</h3>
            <p className="text-3xl font-bold">482</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="font-semibold">Active Staff</h3>
            <p className="text-3xl font-bold">35</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="font-semibold">Open Classes</h3>
            <p className="text-3xl font-bold">16</p>
          </div>
        </Card>
      </div>
    </div>
  );
}