import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Calendar, Clock, User, CheckCircle, X } from "lucide-react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertRappelSchema } from "@shared/schema";
import type { Rappel, Client, InsertRappel } from "@shared/schema";

export default function AgendaPage() {
  const [showNewRappelModal, setShowNewRappelModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rappels, isLoading } = useQuery<Rappel[]>({
    queryKey: ["/api/rappels"],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const form = useForm<InsertRappel>({
    resolver: zodResolver(insertRappelSchema),
    defaultValues: {
      titre: "",
      description: "",
      dateRappel: "",
      type: "appel",
      clientId: 0,
      statut: "en_attente",
    },
  });

  const createRappelMutation = useMutation({
    mutationFn: async (data: InsertRappel) => {
      const response = await apiRequest("POST", "/api/rappels", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rappels"] });
      toast({
        title: "Rappel créé avec succès",
        description: "Le rappel a été ajouté à votre agenda.",
      });
      setShowNewRappelModal(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du rappel.",
        variant: "destructive",
      });
    },
  });

  const completeRappelMutation = useMutation({
    mutationFn: async (rappelId: number) => {
      const response = await apiRequest("PUT", `/api/rappels/${rappelId}`, {
        statut: "fait",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rappels"] });
      toast({
        title: "Rappel marqué comme fait",
        description: "Le rappel a été marqué comme terminé.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case "fait":
        return <Badge className="bg-green-100 text-green-800">Fait</Badge>;
      case "reporte":
        return <Badge className="bg-blue-100 text-blue-800">Reporté</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{statut}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "appel":
        return <Badge className="bg-red-100 text-red-800">Appel</Badge>;
      case "rdv":
        return <Badge className="bg-purple-100 text-purple-800">RDV</Badge>;
      case "relance":
        return <Badge className="bg-orange-100 text-orange-800">Relance</Badge>;
      case "renouvellement":
        return <Badge className="bg-blue-100 text-blue-800">Renouvellement</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{type}</Badge>;
    }
  };

  const getClientName = (clientId: number | null) => {
    if (!clientId) return "Non associé";
    const client = clients?.find((c) => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : "Client inconnu";
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("fr-FR");
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("fr-FR");
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const onSubmit = (data: InsertRappel) => {
    createRappelMutation.mutate(data);
  };

  const handleCompleteRappel = (rappelId: number) => {
    completeRappelMutation.mutate(rappelId);
  };

  const todayRappels = rappels?.filter((rappel) => {
    const today = new Date();
    const rappelDate = new Date(rappel.dateRappel);
    return (
      rappelDate.toDateString() === today.toDateString() &&
      rappel.statut === "en_attente"
    );
  });

  const upcomingRappels = rappels?.filter((rappel) => {
    const today = new Date();
    const rappelDate = new Date(rappel.dateRappel);
    return (
      rappelDate > today &&
      rappel.statut === "en_attente"
    );
  });

  return (
    <Layout title="Agenda & Rappels">
      <div className="space-y-6">
        {/* Rappels du jour */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Rappels du jour</span>
              </CardTitle>
              <Badge variant="destructive">
                {todayRappels?.length || 0}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {todayRappels?.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                Aucun rappel pour aujourd'hui
              </p>
            ) : (
              <div className="space-y-4">
                {todayRappels?.map((rappel) => (
                  <div
                    key={rappel.id}
                    className="flex items-start space-x-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs mt-1">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-slate-800">{rappel.titre}</h4>
                        {getTypeBadge(rappel.type)}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{rappel.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>{formatTime(rappel.dateRappel)}</span>
                        <span>{getClientName(rappel.clientId)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCompleteRappel(rappel.id)}
                      disabled={completeRappelMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rappels à venir */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Rappels à venir</CardTitle>
              <Button onClick={() => setShowNewRappelModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau rappel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-slate-600">Chargement...</p>
              </div>
            ) : upcomingRappels?.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                Aucun rappel à venir
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingRappels?.map((rappel) => (
                  <div
                    key={rappel.id}
                    className="flex items-start space-x-4 p-4 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-xs mt-1">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-slate-800">{rappel.titre}</h4>
                        {getTypeBadge(rappel.type)}
                        {getStatusBadge(rappel.statut)}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{rappel.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>{formatDateTime(rappel.dateRappel)}</span>
                        <span>{getClientName(rappel.clientId)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCompleteRappel(rappel.id)}
                      disabled={completeRappelMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal nouveau rappel */}
      <Dialog open={showNewRappelModal} onOpenChange={setShowNewRappelModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau rappel</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titre">Titre *</Label>
                <Input
                  id="titre"
                  {...form.register("titre")}
                  className="mt-1"
                />
                {form.formState.errors.titre && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.titre.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select onValueChange={(value) => form.setValue("type", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner le type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appel">Appel</SelectItem>
                    <SelectItem value="rdv">Rendez-vous</SelectItem>
                    <SelectItem value="relance">Relance</SelectItem>
                    <SelectItem value="renouvellement">Renouvellement</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.type.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="clientId">Client</Label>
              <Select onValueChange={(value) => form.setValue("clientId", parseInt(value))}>
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

            <div>
              <Label htmlFor="dateRappel">Date et heure *</Label>
              <Input
                id="dateRappel"
                type="datetime-local"
                {...form.register("dateRappel")}
                className="mt-1"
              />
              {form.formState.errors.dateRappel && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.dateRappel.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                rows={3}
                className="mt-1"
                placeholder="Description du rappel..."
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowNewRappelModal(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={createRappelMutation.isPending}>
                {createRappelMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
