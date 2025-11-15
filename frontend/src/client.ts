import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson'; // <--- 1. Importer le frigo

// On importe le TYPE de ton API... c'est le "contrat"
import type { AppRouter } from '../../backend/src/app'; 

// 1. L'objet "trpc" que tes composants vont utiliser
export const trpc = createTRPCReact<AppRouter>();

// 2. Le "moteur" que ton app va utiliser
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc', 
      transformer: superjson, // moved transformer into the link
    }),
  ],
});