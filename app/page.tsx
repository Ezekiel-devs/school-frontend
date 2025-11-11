import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth'; // Assurez-vous que le chemin est correct

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    // Si une session existe, redirige vers le dashboard
    redirect('/home');
  } else {
    // Sinon, redirige vers la page de connexion
    redirect('/login');
  }

  // Ce return n'est jamais atteint, mais est nécessaire pour la signature de la fonction
  return null;
}