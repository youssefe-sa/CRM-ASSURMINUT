import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Download, Trash2, FileText, Image, File } from "lucide-react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocumentUploadModal } from "@/components/modals/document-upload-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Document, Client } from "@shared/schema";

export default function DocumentsPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: number) => {
      await apiRequest("DELETE", `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression du document.",
        variant: "destructive",
      });
    },
  });

  const getDocumentIcon = (mimeType: string) => {
    if (mimeType.includes("image")) {
      return <Image className="h-4 w-4" />;
    } else if (mimeType.includes("pdf")) {
      return <FileText className="h-4 w-4" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "piece_identite":
        return <Badge className="bg-blue-100 text-blue-800">Pièce d'identité</Badge>;
      case "attestation_secu":
        return <Badge className="bg-green-100 text-green-800">Attestation sécu</Badge>;
      case "contrat":
        return <Badge className="bg-purple-100 text-purple-800">Contrat</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Autre</Badge>;
    }
  };

  const getClientName = (clientId: number | null) => {
    if (!clientId) return "Non associé";
    const client = clients?.find((c) => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : "Client inconnu";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const handleDownload = (documentId: number) => {
    window.open(`/api/documents/${documentId}/download`, "_blank");
  };

  const handleDelete = (documentId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      deleteDocumentMutation.mutate(documentId);
    }
  };

  return (
    <Layout title="Documents">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestion des documents</CardTitle>
            <Button onClick={() => setShowUploadModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Téléverser un document
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
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents?.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {getDocumentIcon(document.mimeType)}
                        <span>{document.nom}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(document.type)}</TableCell>
                    <TableCell>{getClientName(document.clientId)}</TableCell>
                    <TableCell>{formatFileSize(document.taille)}</TableCell>
                    <TableCell>{formatDate(document.createdAt || "")}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(document.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(document.id)}
                          disabled={deleteDocumentMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {documents?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500">Aucun document trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      <DocumentUploadModal open={showUploadModal} onClose={() => setShowUploadModal(false)} />
    </Layout>
  );
}
