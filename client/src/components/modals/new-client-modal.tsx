import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertClientSchema } from "@shared/schema";
import type { InsertClient } from "@shared/schema";

interface NewClientModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewClientModal({ open, onClose }: NewClientModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertClient>({
    resolver: zodResolver(insertClientSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      dateNaissance: "",
      numeroSecu: "",
      telephone: "",
      email: "",
      adresse: "",
      situationFamiliale: "",
      nombreAyantsDroit: 0,
      mutuelleActuelle: "",
      niveauCouverture: "",
      statut: "nouveau",
      notes: "",
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async (data: InsertClient) => {
      const response = await apiRequest("POST", "/api/clients", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Client créé avec succès",
        description: "Le client a été ajouté à votre base de données.",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du client.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertClient) => {
    createClientMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nouveau client</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  {...form.register("prenom")}
                  className="mt-1"
                />
                {form.formState.errors.prenom && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.prenom.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  {...form.register("nom")}
                  className="mt-1"
                />
                {form.formState.errors.nom && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.nom.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="dateNaissance">Date de naissance *</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  {...form.register("dateNaissance")}
                  className="mt-1"
                />
                {form.formState.errors.dateNaissance && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.dateNaissance.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="numeroSecu">Numéro de sécurité sociale *</Label>
                <Input
                  id="numeroSecu"
                  {...form.register("numeroSecu")}
                  className="mt-1"
                />
                {form.formState.errors.numeroSecu && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.numeroSecu.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-4">Informations de contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  type="tel"
                  {...form.register("telephone")}
                  className="mt-1"
                />
                {form.formState.errors.telephone && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.telephone.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  className="mt-1"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="adresse">Adresse complète *</Label>
                <Textarea
                  id="adresse"
                  {...form.register("adresse")}
                  rows={3}
                  className="mt-1"
                />
                {form.formState.errors.adresse && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.adresse.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Situation familiale */}
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-4">Situation familiale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="situationFamiliale">Situation familiale *</Label>
                <Select onValueChange={(value) => form.setValue("situationFamiliale", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celibataire">Célibataire</SelectItem>
                    <SelectItem value="marie">Marié(e)</SelectItem>
                    <SelectItem value="divorce">Divorcé(e)</SelectItem>
                    <SelectItem value="veuf">Veuf/Veuve</SelectItem>
                    <SelectItem value="pacs">Pacsé(e)</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.situationFamiliale && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.situationFamiliale.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="nombreAyantsDroit">Nombre d'ayants droit</Label>
                <Input
                  id="nombreAyantsDroit"
                  type="number"
                  min="0"
                  {...form.register("nombreAyantsDroit", { valueAsNumber: true })}
                  className="mt-1"
                />
                {form.formState.errors.nombreAyantsDroit && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.nombreAyantsDroit.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Mutuelle actuelle */}
          <div>
            <h3 className="text-lg font-medium text-slate-800 mb-4">Mutuelle actuelle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mutuelleActuelle">Nom de la mutuelle</Label>
                <Input
                  id="mutuelleActuelle"
                  {...form.register("mutuelleActuelle")}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="niveauCouverture">Niveau de couverture</Label>
                <Select onValueChange={(value) => form.setValue("niveauCouverture", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basique">Basique</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              rows={3}
              className="mt-1"
              placeholder="Notes supplémentaires..."
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button type="button" variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={createClientMutation.isPending}>
              {createClientMutation.isPending ? (
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
