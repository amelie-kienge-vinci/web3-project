import { initTRPC } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import prisma from '../utils/prisma';
import superjson from 'superjson';

/**
 * Contexte: C'est ici qu'on mettrait les choses
 * accessibles dans toutes les procédures (ex: session utilisateur, connexion DB).
 * Pour l'instant, on le laisse vide.
 */
export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  return { prisma };
};

/**
 * Initialisation de tRPC
 */
const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

/**
 * Exporte les briques de base :
 * - router: pour créer des routeurs
 * - publicProcedure: pour créer des routes publiques (sans auth)
 */
export const router = t.router;
export const publicProcedure = t.procedure;