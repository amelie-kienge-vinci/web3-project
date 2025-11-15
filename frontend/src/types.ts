//types.ts


// Poubelle 🗑️

export type Statut = 'EN_ATTENTE' | 'APPROUVEE' | 'REFUSEE';


export interface Demande {
	id: number;
	nom: string;
	prenom: string;
	email: string;
	service: string;
	dateDebut: string; 
	dateFin: string;   
	statut: Statut;
	motivation?: string | null;
	createdAt: string; 
}

export type Service = string;


