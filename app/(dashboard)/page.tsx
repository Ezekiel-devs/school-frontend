'use client';

import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-4">Tableau de Bord Principal</h1>
      <p>
        Bonjour, {session?.user?.firstName} {session?.user?.lastName}.
      </p>
      <p>
        Vous êtes connecté en tant que : <strong>{session?.user?.role}</strong>.
      </p>
      <p className="mt-4">
        Ceci est la page accueil de votre espace administration. Vous pouvez naviguer en utilisant le menu latéral.
      </p>
    </div>
  );
}