import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Phone, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertAppelSchema } from "@shared/schema";
import type { InsertAppel, Client } from "@shared/schema";

interface CallLogModalProps {
  open: boolean;
  onClose: () => void;
  selectedClientId?: number;
}

export function CallLogModal({ open, onClose, selectedClientId }: CallLogModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    enabled: open,
  });

  const form = useForm<InsertAppel>({
    resolver: zodResolver(insertAppelSchema),
    defaultValues: {
      clientId: selectedClientId || 0,
      dateAppel: new Date().toISOString().slice(0, 16),
      duree: 0,
      statut: "repondu",
      notes: "",
      prochainRappel: "",
    },
  });

  const createAppelMutation = useMutation({
    mutationFn: async (data: InsertAppel) => {
      const response = await apiRequest("POST", "/api/appels", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appels"] });
      toast({
        title: "Appel enregistré avec succès",
        description: "L'appel a été ajouté au journal.",
      });
      onClose();
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement de l'appel.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAppel) => {
    createAppelMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Enregistrer un appel</DialogTitle>
          <DialogDescription>
            Enregistrez les détails d'un appel avec un client.
          </DialogDescription>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date et heure */}
            <div>
              <Label htmlFor="dateAppel">Date et heure *</Label>
              <Input
                id="dateAppel"
                type="datetime-local"
                {...form.register("dateAppel")}
                className="mt-1"
              />
              {form.formState.errors.dateAppel && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.dateAppel.message}</p>
              )}
            </div>

            {/* Durée */}
            <div>
              <Label htmlFor="duree">Durée (minutes)</Label>
              <Input
                id="duree"
                type="number"
                min="0"
                {...form.register("duree", { valueAsNumber: true })}
                className="mt-1"
              />
            </div>
          </div>

          {/* Statut */}
          <div>
            <Label htmlFor="statut">Statut de l'appel *</Label>
            <Select onValueChange={(value) => form.setValue("statut", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner le statut..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="repondu">Répondu</SelectItem>
                <SelectItem value="message_vocal">Message vocal</SelectItem>
                <SelectItem value="a_rappeler">À rappeler</SelectItem>
                <SelectItem value="occupe">Occupé</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.statut && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.statut.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              rows={4}
              className="mt-1"
              placeholder="Notes de l'appel..."
            />
          </div>

          {/* Prochain rappel */}
          <div>
            <Label htmlFor="prochainRappel">Prochain rappel (optionnel)</Label>
            <Input
              id="prochainRappel"
              type="datetime-local"
              {...form.register("prochainRappel")}
              className="mt-1"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button type="button" variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={createAppelMutation.isPending}>
              {createAppelMutation.isPending ? (
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
