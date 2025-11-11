import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import api, { isAxiosError } from './api'; 
import { Role } from '@/types/type';
import type { Staff } from '@/types/type';



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith@example.com' },
        password: { label: 'Mot de passe', type: 'password' },
      },
    
      async authorize(credentials): Promise<Staff | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe sont requis');
        }

        try {
          const response = await api.post('/staff/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const user = response.data;

          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          if (isAxiosError(error)) {
            
            const errorMessage = error.response?.data?.message || 'Identifiants ou mot de passe invalides.';
            console.error('Axios Error in authorize:', errorMessage);
            throw new Error(errorMessage);
          }
          
          
          console.error('Generic Error in authorize:', error);
          throw new Error('Une erreur inattendue est survenue.');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt', 
    maxAge: 1 * 24 * 60 * 60, // Durée de vie du JWT: 1 jours
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: '/login', 
  },
  callbacks: {
    async jwt({ token, user }) {
      // `user` est disponible seulement lors de la première connexion (appel `authorize`)
      if (user) {
        const staffUser = user as Staff;
        token.id = staffUser.id;
        token.email = staffUser.email;
        token.firstName = staffUser.firstName;
        token.lastName = staffUser.lastName;
        token.role = staffUser.role;
      }
      return token;
    },
    // Le callback `session` est appelé chaque fois qu'une session est vérifiée
    async session({ session, token }) {
      // `token` contient les données enrichies par le callback `jwt`
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Référence au secret JWT
};