'use client';

import { useSession } from 'next-auth/react';
import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Le middleware garantit la session, mais on utilise `useSession`
  // pour s'assurer que les données sont chargées avant le rendu.
  const { status } = useSession({ required: true });

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}