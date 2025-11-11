// src/components/providers/query-client-provider.tsx
'use client'; // Indique que ce composant s'exécute côté client

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Les données sont considérées comme "stale" après 5 minutes
      refetchOnWindowFocus: false, // Ne pas re-fetcher automatiquement à chaque focus de fenêtre
    },
  },
});

export function QueryClientProviderComponent({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Outil de développement pour React Query, visible uniquement en mode développement */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}