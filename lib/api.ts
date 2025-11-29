// lib/api.ts

import axios, { isAxiosError } from 'axios';
import { getSession, signOut } from 'next-auth/react'; // Importez getSession
import { toast } from 'sonner';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// L'intercepteur doit maintenant être ASYNCHRONE
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const session = await getSession();
      
      // LE LOG LE PLUS IMPORTANT :
      console.log('%c[Axios Interceptor] Session object:', 'color: blue;', );

      if (session && session.backendToken) {
        console.log('%c[Axios Interceptor] Token FOUND. Attaching to header.', 'color: green;');
        config.headers.Authorization = `Bearer ${session.backendToken}`;
      } else {
        console.log('%c[Axios Interceptor] Token NOT FOUND in session.', 'color: red;');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// L'intercepteur de réponse ne change pas, il est toujours utile.
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        console.error("Token API expiré ou invalide. Déconnexion automatique.");
       toast.error("Your session has expired", {
         description: "Please log in again to continue.",
       });

       // On utilise la fonction signOut de NextAuth pour déconnecter proprement l'utilisateur
       // et le rediriger vers la page de connexion.
       signOut({ callbackUrl: '/login' }); 

      }
      return Promise.reject(error);
    }
  );

export default api;
export { isAxiosError };