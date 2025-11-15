import { router, publicProcedure } from '../trpc/trpc';
// ON IMPORTE TES VRAIS SCHÉMAS ZOD (ancien 'model')
// Note: Le chemin d'importation est une supposition, ajuste-le
import { demandeSchema, demandeStatusUpdateSchema } from '../demandes/demandeModel'; 
import { z } from 'zod';

// ON IMPORTE TON REPOSITORY, PAS LE CONTROLLER !
// Note: Le chemin d'importation est une supposition, ajuste-le
import * as demandeRepository from '../demandes/demandeRepository';
import { TRPCError } from '@trpc/server';

// On recrée le schéma pour getById qui était dans 'demande.schemas.ts'
// ou on pourrait l'ajouter à 'demandeModel.ts'
const getByIdSchema = z.object({
  id: z.number().int(),
});

// On doit aussi adapter le schéma de mise à jour pour inclure l'ID
const updateStatusSchemaWithId = demandeStatusUpdateSchema.extend({
  id: z.number().int(),
});


/**
 * C'est la migration.
 * On appelle le REPOSITORY directement.
 * On valide avec tes SCHÉMAS ZOD existants.
 * Adieu (req, res) !
 */
export const demandeRouter = router({
  
  /**
   * Remplace: GET /api/demandes
   */
  list: publicProcedure
    .query(async () => {
      // Appelle directement la logique métier
      const demandes = await demandeRepository.getAllDemandes(); 
      return demandes;
    }),

  /**
   * Remplace: GET /api/demandes/services
   */
  listServices: publicProcedure
    .query(async () => {
      const services = await demandeRepository.getServices();
      return services;
    }),

  /**
   * Remplace: GET /api/demandes/{id}
   */
  getById: publicProcedure
    .input(getByIdSchema) // <-- Utilise ton schéma Zod
    .query(async ({ input }) => {
      // 'input' est GARANTI d'être { id: number }
      const demande = await demandeRepository.getDemandeById(input.id);
      
      // Bonne pratique : gérer le 404
      if (!demande) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Demande non trouvée',
        });
      }
      return demande;
    }),

  /**
   * Remplace: POST /api/demandes
   */
  create: publicProcedure
    .input(demandeSchema) // <-- Utilise ton schéma de création
    .mutation(async ({ input }) => {
      // 'input' est GARANTI d'être conforme à 'demandeSchema'
      // et les dates sont déjà transformées par Zod !
      const nouvelleDemande = await demandeRepository.createDemande(input);
      return nouvelleDemande;
    }),

  /**
   * Remplace: PATCH /api/demandes/{id}/status
   */
  updateStatus: publicProcedure
    .input(updateStatusSchemaWithId) // <-- Utilise le schéma combiné
    .mutation(async ({ input }) => {
      // 'input' est { id: number, statut: "EN_ATTENTE" | ... }
      
      // On vérifie que la demande existe (logique de ton ancien controller)
      const existing = await demandeRepository.getDemandeById(input.id);
      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Demande non trouvée pour mise à jour',
        });
      }

      // On passe les données au format attendu par le repository
      // (Le repo attend: id, { statut: "..." })
      const { id, statut } = input;
      const demandeMiseAJour = await demandeRepository.updateDemandeStatus(id, { statut });
      return demandeMiseAJour;
    }),
});