// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // Importe les options de configuration de NextAuth.js

// Crée le gestionnaire NextAuth.js
const handler = NextAuth(authOptions);

// Exporte les gestionnaires GET et POST pour les requêtes d'authentification
export { handler as GET, handler as POST };