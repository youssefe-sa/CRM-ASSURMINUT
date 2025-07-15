import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Edit, Trash2, FileText, Phone } from "lucide-react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewClientModal } from "@/components/modals/new-client-modal";
import { NewDevisModal } from "@/components/modals/new-devis-modal";
import { CallLogModal } from "@/components/modals/call-log-modal";
import type { Client } from "@shared/schema";

export default function Clients() {
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showNewDevisModal, setShowNewDevisModal] = useState(false);
  const [showCallLogModal, setShowCallLogModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const filteredClients = clients?.filter((client) =>
    client.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "nouveau":
        return <Badge className="bg-green-100 text-green-800">Nouveau</Badge>;
      case "prospect":
        return <Badge className="bg-yellow-100 text-yellow-800">Prospect</Badge>;
      case "client":
        return <Badge className="bg-blue-100 text-blue-800">Client</Badge>;
      case "perdu":
        return <Badge className="bg-red-100 text-red-800">Perdu</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const handleCreateDevis = (clientId: number) => {
    setSelectedClientId(clientId);
    setShowNewDevisModal(true);
  };

  const handleCreateCall = (clientId: number) => {
    setSelectedClientId(clientId);
    setShowCallLogModal(true);
  };

  return (
    <Layout title="Clients" onNewClient={() => setShowNewClientModal(true)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des clients</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowNewClientModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau client
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-slate-600">Chargement...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients?.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.prenom} {client.nom}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.telephone}</TableCell>
                    <TableCell>{getStatusBadge(client.statut)}</TableCell>
                    <TableCell>{formatDate(client.createdAt || "")}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCreateDevis(client.id)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCreateCall(client.id)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {filteredClients?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">Aucun client trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      <NewClientModal open={showNewClientModal} onClose={() => setShowNewClientModal(false)} />
      <NewDevisModal
        open={showNewDevisModal}
        onClose={() => {
          setShowNewDevisModal(false);
          setSelectedClientId(undefined);
        }}
        selectedClientId={selectedClientId}
      />
      <CallLogModal
        open={showCallLogModal}
        onClose={() => {
          setShowCallLogModal(false);
          setSelectedClientId(undefined);
        }}
        selectedClientId={selectedClientId}
      />
    </Layout>
  );
}
