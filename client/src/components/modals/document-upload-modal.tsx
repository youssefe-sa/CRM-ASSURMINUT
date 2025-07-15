import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Client } from "@shared/schema";

interface DocumentUploadModalProps {
  open: boolean;
  onClose: () => void;
  selectedClientId?: number;
}

interface DocumentUploadData {
  type: string;
  clientId?: number;
  file: File;
}

export function DocumentUploadModal({ open, onClose, selectedClientId }: DocumentUploadModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    enabled: open,
  });

  const form = useForm<DocumentUploadData>({
    defaultValues: {
      type: "autre",
      clientId: selectedClientId,
    },
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async (data: DocumentUploadData) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("type", data.type);
      if (data.clientId) {
        formData.append("clientId", data.clientId.toString());
      }

      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors du téléversement");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document téléversé avec succès",
        description: "Le document a été ajouté à la base de données.",
      });
      onClose();
      form.reset();
      setSelectedFile(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors du téléversement.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DocumentUploadData) => {
    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier.",
        variant: "destructive",
      });
      return;
    }

    uploadDocumentMutation.mutate({ ...data, file: selectedFile });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Téléverser un document</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Type de document */}
          <div>
            <Label htmlFor="type">Type de document *</Label>
            <Select 
              onValueChange={(value) => form.setValue("type", value)}
              defaultValue="autre"
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner le type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piece_identite">Pièce d'identité</SelectItem>
                <SelectItem value="attestation_secu">Attestation sécurité sociale</SelectItem>
                <SelectItem value="contrat">Contrat signé</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Client */}
          <div>
            <Label htmlFor="clientId">Client (optionnel)</Label>
            <Select 
              onValueChange={(value) => form.setValue("clientId", parseInt(value))}
              defaultValue={selectedClientId?.toString()}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner un client..." />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.prenom} {client.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fichier */}
          <div>
            <Label htmlFor="file">Fichier *</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              className="mt-1"
            />
            {selectedFile && (
              <p className="text-sm text-slate-600 mt-1">
                Fichier sélectionné: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button type="button" variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={uploadDocumentMutation.isPending}>
              {uploadDocumentMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Téléversement...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Téléverser
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
