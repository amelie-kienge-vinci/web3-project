// frontend/src/services/DemandeService.tsx

// Poubelle 🗑️
const API_URL = 'http://localhost:3000/api/demandes';

const getAllDemandes = async () => {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des demandes');
    }
    return response.json();
};

const getServices = async () => {
    const response = await fetch(`${API_URL}/services`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des services');
    }
    return response.json();
};

const createDemande = async (demandeData: {
    nom: string;
    prenom: string;
    email: string;
    service: string;
    dateDebut: string;
    dateFin: string;
    motivation?: string;
}) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(demandeData),
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la création de la demande');
    }
    return response.json();
};

const getDemandeById = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la demande');
    }
    return response.json();
};

const updateDemandeStatus = async (id: string, statut: { statut: string }) => {
    const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(statut),
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
    }
    return response.json();
};

export { getAllDemandes, getServices, createDemande, getDemandeById, updateDemandeStatus };