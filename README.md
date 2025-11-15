# Stages — Migration d'une API REST vers tRPC

Ce dépôt contient une mini-application de gestion de demandes de stages hospitaliers.

À l'origine une application REST classique, ce projet a été migré vers **tRPC** pour démontrer les gains massifs en termes de **typesafety de bout en bout** et de **Developer Experience (DX)**.

---

## 📋 Résumé technique

**Backend**  
Node.js · TypeScript · Express · Prisma (Postgres) · tRPC · SuperJSON

**Frontend**  
React · TypeScript · Vite · Ant Design · React Query · tRPC Client

**Architecture API**  
`/trpc` : API tRPC (la version "Après")

---

## 🚀 Démarrage rapide

### Avec Docker (recommandé)

**1. Construire et démarrer les services** (Postgres, backend, frontend)

```bash
docker compose up --build
```

**2. Peupler la base avec des données de test**

```bash
docker exec -it demandes-backend node ./scripts/db-populate.js
```

**3. Accès après démarrage**

- **Frontend** : [http://localhost:5173](http://localhost:5173)
- **Endpoint tRPC** : [http://localhost:3000/trpc](http://localhost:3000/trpc)

### Sans Docker (développement local)

**Backend**

```bash
cd backend
npm install
# ... setup .env et prisma ...
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## 🎯 L'Objectif de la Migration tRPC

Ce projet n'est pas une simple app REST. C'est une **démonstration de migration de REST vers tRPC** pour résoudre les problèmes de maintenance des API traditionnelles.

### 1️⃣ Le Problème : Le "Contrat" Manuel de REST

L'API REST (`/api`) repose sur un **contrat manuel** :

- Le backend espère que le front envoie le bon JSON
- Le front espère que le backend renvoie la bonne structure
- Le fichier `frontend/src/types.ts` est un **mensonge écrit à la main**
- La documentation (Swagger) est la seule source de vérité, et elle est souvent **obsolète**

### 2️⃣ La Solution : Le "Contrat" Forcé de tRPC

L'API tRPC (`/trpc`) est un **contrat forcé par le compilateur TypeScript**.

#### a) Fini le "Boilerplate"

Nous avons supprimé des fichiers entiers :

- `frontend/src/services/DemandeService.tsx` ➡️ **Poubelle 🗑️**  
  Remplacé par `trpc.demandes.list.useQuery()`

- `frontend/src/types.ts` ➡️ **Poubelle 🗑️**  
  Remplacé par l'inférence de types

#### b) Le "Vol" de Types

Le front n'écrit plus jamais de types manuels. Il les **vole directement au backend**.

```typescript
// On importe le TYPE du backend (le "contrat")
import type { AppRouter } from '../../../backend/src/app';

// On importe "l'extracteur"
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';

// On vole le type de l'output de la procédure 'list'
type Demande = inferProcedureOutput<AppRouter['demandes']['list']>[number];

// On vole le type de l'input de la procédure 'updateStatus'
type UpdateStatusInput = inferProcedureInput<AppRouter['demandes']['updateStatus']>;
// Résultat: { id: number, statut: "EN_ATTENTE" | ... }
```

**Résultat** : Si le backend change un champ, le frontend casse **dans l'IDE**, pas en production.

#### c) La Gestion des "Boss de Fin"

La migration n'est pas magique. Nous avons dû gérer les défis du setup :

**Le Problème des Date (JSON)**  
JSON transforme les `Date` en `string`, ce qui casse tout.

**Solution** : Utilisation de **superjson** comme "transporteur réfrigéré" côté client et serveur pour que les `Date` restent des `Date`.

**Le Setup Client**  
`QueryClient` (le "moteur") doit être wrappé dans un `useState(() => ...)` pour survivre aux re-renders de React.

**Le "Troll" des URL**  
L'URL tRPC (ex: `.../getById?input={"id":1}`) est illisible. C'est intentionnel, pour forcer l'utilisation du client typesafe.

#### d) Tests d'Intégration 100x Plus Rapides

**Avant (REST)**  
On devait lancer le serveur (`npm run dev`) pour tester une URL (HTTP), ce qui est lent.

**Après (tRPC)**  
On n'a plus besoin de serveur. Les tests (`.test.ts`) importent le `appRouter` comme un simple objet JS et appellent ses fonctions. C'est **instantané**.

---

## 📦 Prérequis

- Node.js
- npm
- Docker & Docker Compose (recommandé)