
import { useParams } from "react-router-dom";

import { Alert, Button, Card, Descriptions, Spin, Tag } from "antd";
import { trpc } from '../client'; 
import type { inferProcedureInput } from '@trpc/server';
import type { AppRouter } from '../../../backend/src/app';

type Statut = inferProcedureInput<AppRouter['demandes']['updateStatus']>['statut'];
const ViewDemandePage = () => {


  const { id } = useParams<{ id: string }>();
  /* Poubelle 🗑 
  const [demande, setDemande] = useState<Demande | null>(null);
  const [error, setError] = useState<string | null>(null);

 ️
  useEffect(() => {
    const loadDetails = async () => {
      try {
        if (id) {
          const data = await getDemandeById(id);
          setDemande(data);
        } else {
          console.error("ID de la demande manquant");
        }
      } catch (error) {
        console.error(error);
        setError("Erreur lors de la récupération de la demande");
      }
    };
    loadDetails();
  }, [id]);

  const updateStatus = async (newStatus: Statut, demande: Demande) => {
    try {
        const updatedDemande = { ...demande, statut: newStatus };
        setDemande(updatedDemande);
        await updateDemandeStatus(demande.id.toString(), { statut: newStatus });
      
    } catch (error) {
      console.error(error);
      setError("Erreur lors de la mise à jour du statut");
    }
  };
  */


 const { 
    data: demande, 
    isLoading, 
    error 
  } = trpc.demandes.getById.useQuery(
    { id: Number(id) }, // L'input de la procédure
    { enabled: !!id }  // Ne lance pas la query si l'ID est pas prêt
  );

  const utils = trpc.useUtils(); // L'outil pour rafraîchir le cache

  const updateStatusMutation = trpc.demandes.updateStatus.useMutation({
    onSuccess: () => {
      // MAGIE : Quand la MAJ réussit, on dit à tRPC
      // de "rafraîchir" la query 'getById'.
      // La page se met à jour toute seule.
      //pas besoin de setDemande ou autre.
      utils.demandes.getById.invalidate({ id: Number(id) });
    },
    onError: (error) => {
      // Gère l'erreur pour toi
      console.error(error);
      alert("Erreur lors de la mise à jour");
    }
  });

  // Le handler qui appelle la mutation (typesafe !)
  const handleUpdateStatus = (newStatus: Statut) => {
    if (!id) return;
    
    // On appelle la mutation. L'input est 100% typé.
    // Si tu oublies 'statut', TypeScript hurle.
    updateStatusMutation.mutate({
      id: Number(id),
      statut: newStatus
    });
  };
  return (
    <div>
      <h1>Détails de la Demande</h1>

      {error ? (
        <Alert
          message={error.message}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )  : isLoading ? ( // On utilise le isLoading du hook
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin tip="Chargement des détails de la demande..." />
        </div>
      ) : demande ? (
        <>
          <Card>
            <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="Statut">
                {
                  demande.statut === 'EN_ATTENTE' ? (
                    <Tag color="orange">En attente</Tag>
                  ) : demande.statut === 'APPROUVEE' ? (
                    <Tag color="green">Approuvée</Tag>
                  ) : (
                    <Tag color="red">Refusée</Tag>
                  )
                }
              </Descriptions.Item>
              <Descriptions.Item label="Nom complet">
                {demande.nom} {demande.prenom}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {demande.email}
              </Descriptions.Item>
              <Descriptions.Item label="Service">
                {demande.service}
              </Descriptions.Item>
              
              <Descriptions.Item label="Date de début">
                {new Date(demande.dateDebut).toLocaleDateString('fr-FR')}
              </Descriptions.Item>
              <Descriptions.Item label="Date de fin">
                {new Date(demande.dateFin).toLocaleDateString('fr-FR')}
              </Descriptions.Item>
              <Descriptions.Item label="Motivation">
                {demande.motivation}
              </Descriptions.Item>
              <Descriptions.Item label="Date de création">
                {new Date(demande.createdAt).toLocaleDateString('fr-FR')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          
          <>
            {demande.statut === 'EN_ATTENTE' ? (
              <div style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  onClick={() => handleUpdateStatus('APPROUVEE')}
                >
                  Approuver la demande
                </Button>

                <Button
                  type="primary"
                  danger
                  style={{ marginLeft: 8 }}
                  onClick={() => handleUpdateStatus('REFUSEE')}
                >
                  Rejeter la demande
                </Button>
              </div>
            ) : (
              <div style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  onClick={() => handleUpdateStatus('EN_ATTENTE')}
                >
                  Remettre en attente
                </Button>
              </div>
            )}
          </>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin tip="Chargement des détails de la demande..." />
        </div>
      )}
    </div>
  );
};

export default ViewDemandePage;
