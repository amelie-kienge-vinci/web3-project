import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as trpcExpress from "@trpc/server/adapters/express";

// --- Imports pour la démo "AVANT" (REST) ---
//import demandeRouter from "./demandes/demandeRouter"; // L'ancien router REST
//import setupSwagger from "./swagger";

// --- Imports pour la démo "APRÈS" (tRPC) ---
import { createContext, router } from "./trpc/trpc";
import { demandeRouter } from "./demandes/demande.router";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Route de base ---
app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// --- DÉMO "AVANT" : L'API REST CLASSIQUE ---
//app.use("/api/demandes", demandeRouter);
//setupSwagger(app); 


 const appRouter = router({
  demandes: demandeRouter, 
  
});
export type AppRouter = typeof appRouter;
// --- DÉMO "APRÈS" : L'API TRPC ---
// Tout ce qui arrive sur /trpc est géré par tRPC.
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export { app, appRouter };