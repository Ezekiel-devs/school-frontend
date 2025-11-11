import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold">Bienvenue sur votre Tableau de Bord</h1>
        <p className="mt-2 text-muted-foreground">
          Utilisez la navigation sur la gauche pour gérer les élèves, le personnel, les classes et plus encore.
        </p>
      </Card>
      
      {/* Ici, vous pourrez ajouter des cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <div className="p-4">
            <h3 className="font-semibold">Élèves Inscrits</h3>
            <p className="text-3xl font-bold">482</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="font-semibold">Personnel Actif</h3>
            <p className="text-3xl font-bold">35</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <h3 className="font-semibold">Classes Ouvertes</h3>
            <p className="text-3xl font-bold">16</p>
          </div>
        </Card>
      </div>
    </div>
  );
}