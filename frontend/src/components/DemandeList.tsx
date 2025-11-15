import { Button, Select, Spin, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import type { Demande, Service } from "../types";
import { trpc } from '../client'; 
import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '../../../backend/src/app';
type Demande = inferProcedureOutput<AppRouter['demandes']['list']>[number];

const DemandeList = () => {
const navigate = useNavigate();
  /* Poubelle 🗑️
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    loadDemandes();
    loadServices();
  }, []);

  const loadDemandes = async () => {
    try {
      setLoading(true);
      const data = await getAllDemandes();
      setDemandes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
 */

  const { 
    data: demandes = [], 
    isLoading: loadingDemandes 
  } = trpc.demandes.list.useQuery();

  // ÇA REMPLACE : const [services, setServices] + loadServices()
  const { 
    data: services = [], 
    isLoading: loadingServices 
  } = trpc.demandes.listServices.useQuery();

 const loading = loadingDemandes || loadingServices;

    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined
  );
  const [selectedService, setSelectedService] = useState<string | undefined>(
    undefined
  );
  const filteredDemandes = demandes.filter((demande) => {
    return (
      (selectedStatus ? demande.statut === selectedStatus : true) &&
      (selectedService ? demande.service === selectedService : true)
    );
  });

  const columns = [
    {
      title: "Nom complet",
      key: "fullName",
      render: (_: unknown, record: Demande) => `${record.nom} ${record.prenom}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Période",
      key: "periode",
      render: (_: unknown, record: Demande) => {
        const debut = new Date(record.dateDebut).toLocaleDateString("fr-FR");
        const fin = new Date(record.dateFin).toLocaleDateString("fr-FR");
        return `${debut} → ${fin}`;
      },
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      render: (statut: string) => <span>{statut}</span>,
    },
  ];
  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      ></div>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => navigate("/ajouter-demande")}
      >
        Nouvelle demande
      </Button>

      <Select
        placeholder="Filtrer par statut"
        style={{ width: 200 }}
        allowClear
        onChange={(value) => setSelectedStatus(value)}
        options={[
          { label: "En attente", value: "EN_ATTENTE" },
          { label: "Approuvée", value: "APPROUVEE" },
          { label: "Refusée", value: "REFUSEE" },
        ]}
      />
      <Select
        placeholder="Filtrer par service"
        style={{ width: 200 }}
        allowClear
        onChange={(value) => setSelectedService(value)}
        options={services.map((service) => ({
          label: service,
          value: service,
        }))}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={filteredDemandes}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "Aucune demande trouvée" }}
          onRow={(d: Demande) => ({
            onClick: () => navigate(`/demande-details/${d.id}`),
            style: { cursor: 'pointer' },
            tabIndex: 0,
            role: 'button',
          })}
        />
      )}
    </div>
  );
};

export default DemandeList;
