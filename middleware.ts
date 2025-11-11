// On importe simplement le middleware par défaut de NextAuth.js.
// Il gérera automatiquement la vérification du token et la redirection vers la page de connexion
// que nous avons définie dans `authOptions` (`pages: { signIn: '/login' }`).
export { default } from 'next-auth/middleware';

// La configuration `config` indique au middleware quelles routes il doit protéger.
export const config = {
  matcher: [
    // Protéger toutes les routes qui commencent par /dashboard
    '/home/:path*',

    // Protéger toutes les routes qui commencent par /students
    '/students/:path*',

    // Protéger toutes les routes qui commencent par /classes
    '/classes/:path*',

    // Ajoutez ici d'autres préfixes de routes à protéger
    // '/reports/:path*',
    // '/settings/:path*',
  ],
};