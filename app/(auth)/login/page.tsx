'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoginForm } from '@/components/auth/login-form'; // On importe notre nouveau composant

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  // On garde la logique de redirection au niveau de la page
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home');
    }
  }, [status, router]);

  // Affiche un loader pendant la vérification de la session
  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  // Si non authentifié, on affiche le formulaire de connexion
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted p-4">
      <LoginForm />
    </div>
  );
}