import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { X, Save, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertDevisSchema } from "@shared/schema";
import type { InsertDevis, Client } from "@shared/schema";

interface NewDevisModalProps {
  open: boolean;
  onClose: () => void;
  selectedClientId?: number;
}

export function NewDevisModal({ open, onClose, selectedClientId }: NewDevisModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    enabled: open,
  });

  const form = useForm<InsertDevis>({
    resolver: zodResolver(insertDevisSchema),
    defaultValues: {
      clientId: selectedClientId || 0,
      typeDevis: "",
      montantMensuel: "",
      garanties: {},
      statut: "brouillon",
      dateValidite: "",
      observations: "",
    },
  });

  const createDevisMutation = useMutation({
    mutationFn: async (data: InsertDevis) => {
      const response = await apiRequest("POST", "/api/devis", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devis"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Devis créé avec succès",
        description: "Le devis a été enregistré.",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du devis.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertDevis) => {
    createDevisMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nouveau devis</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Client */}
          <div>
            <Label htmlFor="clientId">Client *</Label>
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
            {form.formState.errors.clientId && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.clientId.message}</p>
            )}
          </div>

          {/* Type de devis */}
          <div>
            <Label htmlFor="typeDevis">Type de devis *</Label>
            <Select onValueChange={(value) => form.setValue("typeDevis", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner le type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individuel">Individuel</SelectItem>
                <SelectItem value="famille">Famille</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="jeune">Jeune</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.typeDevis && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.typeDevis.message}</p>
            )}
          </div>

          {/* Montant */}
          <div>
            <Label htmlFor="montantMensuel">Montant mensuel (€) *</Label>
            <Input
              id="montantMensuel"
              type="number"
              step="0.01"
              {...form.register("montantMensuel")}
              className="mt-1"
            />
            {form.formState.errors.montantMensuel && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.montantMensuel.message}</p>
            )}
          </div>

          {/* Date de validité */}
          <div>
            <Label htmlFor="dateValidite">Date de validité *</Label>
            <Input
              id="dateValidite"
              type="date"
              {...form.register("dateValidite")}
              className="mt-1"
            />
            {form.formState.errors.dateValidite && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.dateValidite.message}</p>
            )}
          </div>

          {/* Observations */}
          <div>
            <Label htmlFor="observations">Observations</Label>
            <Textarea
              id="observations"
              {...form.register("observations")}
              rows={3}
              className="mt-1"
              placeholder="Observations et notes..."
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button type="button" variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={createDevisMutation.isPending}>
              {createDevisMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
