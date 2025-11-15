import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { RouterProvider } from 'react-router-dom'
import router from './router'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { trpc, trpcClient } from './client';

export default function MainApp() {
  // On setup les clients (une seule fois)
  const [queryClient] = useState(() => new QueryClient());

  return (
    <StrictMode>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </trpc.Provider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<MainApp />);