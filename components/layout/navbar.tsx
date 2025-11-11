'use client';

import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { data: session } = useSession();

  if (!session) return null; // Ne rien afficher si la session n'est pas encore chargée

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-xl font-semibold">
          {/* On pourrait rendre ce titre dynamique plus tard */}
          Bienvenue
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">
            {session.user.firstName} {session.user.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{session.user.role}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Déconnexion
        </Button>
      </div>
    </header>
  );
}