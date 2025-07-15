import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, FileText, Download, Edit, Trash2, Eye } from "lucide-react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { NewDevisModal } from "@/components/modals/new-devis-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Devis, Client } from "@shared/schema";

export default function DevisPage() {
  const [showNewDevisModal, setShowNewDevisModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devisList, isLoading } = useQuery<Devis[]>({
    queryKey: ["/api/devis"],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const generatePDFMutation = useMutation({
    mutationFn: async (devisId: number) => {
      const response = await apiRequest("POST", `/api/devis/${devisId}/generate-pdf`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "PDF généré avec succès",
        description: "Le devis a été généré en PDF.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/devis"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la génération du PDF.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "brouillon":
        return <Badge className="bg-gray-100 text-gray-800">Brouillon</Badge>;
      case "envoye":
        return <Badge className="bg-blue-100 text-blue-800">Envoyé</Badge>;
      case "accepte":
        return <Badge className="bg-green-100 text-green-800">Accepté</Badge>;
      case "refuse":
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getClientName = (clientId: number) => {
    const client = clients?.find((c) => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : "Client inconnu";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const formatCurrency = (amount: string) => {
    return `${amount}€`;
  };

  return (
    <Layout title="Devis">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des devis</CardTitle>
            <Button onClick={() => setShowNewDevisModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau devis
            </Button>
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
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant mensuel</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date validité</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devisList?.map((devis) => (
                  <TableRow key={devis.id}>
                    <TableCell className="font-medium">{devis.numeroDevis}</TableCell>
                    <TableCell>{getClientName(devis.clientId)}</TableCell>
                    <TableCell className="capitalize">{devis.typeDevis}</TableCell>
                    <TableCell>{formatCurrency(devis.montantMensuel)}</TableCell>
                    <TableCell>{getStatusBadge(devis.statut)}</TableCell>
                    <TableCell>{formatDate(devis.dateValidite)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generatePDFMutation.mutate(devis.id)}
                          disabled={generatePDFMutation.isPending}
                        >
                          <Download className="h-4 w-4" />
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
          
          {devisList?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">Aucun devis trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      <NewDevisModal open={showNewDevisModal} onClose={() => setShowNewDevisModal(false)} />
    </Layout>
  );
}
