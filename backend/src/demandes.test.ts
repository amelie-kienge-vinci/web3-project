import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { appRouter } from "./app";
import { createContext } from './trpc/trpc';
import type { AppRouter } from './app';
import type { inferProcedureInput } from '@trpc/server';
import { TRPCError } from '@trpc/server';

// On importe le VRAI client prisma pour nettoyer la BDD
import prisma from './utils/prisma'; 

// Contexte simple (pas de req/res, on n'est pas en HTTP)
const mockContext = createContext({} as any);

// =================================================================
// L'UTILITÉ #1 : LE "CALLER"
// On crée un "caller". C'est l'équivalent de Postman / ton .http,
// MAIS en 100% TypeScript et SANS serveur.
// =================================================================
const caller = appRouter.createCaller(mockContext);

describe('Tests d\'intégration tRPC)', () => {

  // --- Setup de la BDD de Test ---
  // (On fait ça pour que nos tests soient propres)
  beforeEach(async () => {
    await prisma.demande.deleteMany({});
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
  // --- Fin du Setup ---


  // =================================================================
  // LE TEST "SLAY" 1 : LA CRÉATION
  // =================================================================
  it('devrait créer une demande ET être 100% typesafe', async () => {
    
    // --- L'UTILITÉ #2 : INPUT TYPESAFE ---
    // Plus besoin de "deviner" le body.
    // On demande à tRPC "c'est quoi l'input pour 'create' ?"
   
 type CreateInput = inferProcedureInput<AppRouter['demandes']['create']>;
    // Si tu oublies 'nom' ou si 'email' n'est pas un email,
    // C'est TypeScript qui crie, pas le serveur.
    const input: CreateInput = {
      nom: "Test",
      prenom: "tRPC",
      email: "test@trpc.io",
      service: "Dev",
      dateDebut: new Date('2025-01-01').toISOString(),
      dateFin: new Date('2025-01-31').toISOString(),
      motivation: "Test de la mutation",
    };

    // --- L'UTILITÉ #3 : APPEL DIRECT (PAS D'HTTP) ---
    // REGARDE BIEN : On n'appelle pas `fetch('http://...')`.
    // On appelle une fonction. C'est 100x plus rapide.
    // Ton serveur Express (`app.ts`) n'a MÊME PAS BESOIN DE TOURNER.
    const nouvelleDemande = await caller.demandes.create(input);

    // --- L'UTILITÉ #4 : OUTPUT TYPESAFE ---
    // Le 'nouvelleDemande' est typé ! Fini les `json.data.user`.
    // Tu as l'autocomplétion directe.
    expect(nouvelleDemande.nom).toBe("Test");
    expect(nouvelleDemande.id).toEqual(expect.any(Number));
  });

  it('devrait lister les demandes créées', async () => {

    type CreateInput = inferProcedureInput<AppRouter['demandes']['create']>;
    // Si tu oublies 'nom' ou si 'email' n'est pas un email,
    // C'est TypeScript qui crie, pas le serveur.
    const input: CreateInput = {
      nom: "Test",
      prenom: "tRPC",
      email: "test@trpc.io",
      service: "Dev",
      dateDebut: new Date('2025-01-01').toISOString(),
      dateFin: new Date('2025-01-31').toISOString(),
      motivation: "Test de la mutation",
    };

    // --- L'UTILITÉ #3 : APPEL DIRECT (PAS D'HTTP) ---
    // REGARDE BIEN : On n'appelle pas `fetch('http://...')`.
    // On appelle une fonction. C'est 100x plus rapide.
    // Ton serveur Express (`app.ts`) n'a MÊME PAS BESOIN DE TOURNER.
    const nouvelleDemande = await caller.demandes.create(input);
    const demandes = await caller.demandes.list();
    expect(demandes).toBeInstanceOf(Array);
    expect(demandes.length).toBe(1);
    

  });
  // =================================================================
  // LE TEST "SLAY" 2 :LA GESTION D'ERREUR
  // =================================================================
  it('devrait renvoyer une VRAIE ERREUR (pas un JSON 404)', async () => {
    // On s'attend à ce que le 'catch' soit exécuté
    expect.assertions(3); 

    try {
      // On appelle une fonction qui va échouer
      await caller.demandes.getById({ id: 999999 });
    } catch (error) {
      
      // --- L'UTILITÉ #5 : ERREURS TYPESAFE ---
      // Fini de checker `if (res.status === 404)`.
      // On est dans un VRAI `try/catch` JavaScript.
      // On 'catch' une vraie `Error` !
      expect(error).toBeInstanceOf(TRPCError);
      
      // On peut même checker le code d'erreur tRPC
      if (error instanceof TRPCError) {
        expect(error.code).toBe('NOT_FOUND');
        expect(error.message).toBe('Demande non trouvée');
      }
    }
  });
});