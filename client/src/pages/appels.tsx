import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Phone, Clock, User, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CallLogModal } from "@/components/modals/call-log-modal";
import type { Appel, Client } from "@shared/schema";

export default function AppelsPage() {
  const [showCallLogModal, setShowCallLogModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>();

  const { data: appels, isLoading } = useQuery<Appel[]>({
    queryKey: ["/api/appels"],
  });

  const { data: clients } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "repondu":
        return <Badge className="bg-green-100 text-green-800">Répondu</Badge>;
      case "message_vocal":
        return <Badge className="bg-blue-100 text-blue-800">Message vocal</Badge>;
      case "a_rappeler":
        return <Badge className="bg-yellow-100 text-yellow-800">À rappeler</Badge>;
      case "occupe":
        return <Badge className="bg-red-100 text-red-800">Occupé</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{statut}</Badge>;
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "repondu":
        return <Phone className="h-4 w-4 text-green-600" />;
      case "message_vocal":
        return <MessageCircle className="h-4 w-4 text-blue-600" />;
      case "a_rappeler":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "occupe":
        return <Phone className="h-4 w-4 text-red-600" />;
      default:
        return <Phone className="h-4 w-4 text-gray-600" />;
    }
  };

  const getClientName = (clientId: number) => {
    const client = clients?.find((c) => c.id === clientId);
    return client ? `${client.prenom} ${client.nom}` : "Client inconnu";
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("fr-FR");
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return "N/A";
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const handleNewCall = (clientId?: number) => {
    setSelectedClientId(clientId);
    setShowCallLogModal(true);
  };

  const todayAppels = appels?.filter((appel) => {
    const today = new Date();
    const appelDate = new Date(appel.dateAppel);
    return appelDate.toDateString() === today.toDateString();
  });

  const rappelsToday = appels?.filter((appel) => {
    const today = new Date();
    const rappelDate = appel.prochainRappel ? new Date(appel.prochainRappel) : null;
    return rappelDate && rappelDate.toDateString() === today.toDateString();
  });

  return (
    <Layout title="Journal des appels">
      <div className="space-y-6">
        {/* Statistiques du jour */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Appels aujourd'hui</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {todayAppels?.length || 0}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <Phone className="text-primary h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Appels répondus</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {todayAppels?.filter((a) => a.statut === "repondu").length || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                  <Phone className="text-green-600 h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Rappels à faire</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {rappelsToday?.length || 0}
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-full">
                  <Clock className="text-yellow-600 h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rappels à faire aujourd'hui */}
        {rappelsToday && rappelsToday.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Rappels à faire aujourd'hui</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rappelsToday.map((appel) => (
                  <div
                    key={appel.id}
                    className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {getClientName(appel.clientId)}
                        </p>
                        <p className="text-sm text-slate-600">
                          Dernier appel: {formatDateTime(appel.dateAppel)}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleNewCall(appel.clientId)}
                      size="sm"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Historique des appels */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historique des appels</CardTitle>
              <Button onClick={() => handleNewCall()}>
                <Plus className="h-4 w-4 mr-2" />
                Enregistrer un appel
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
                    <TableHead>Client</TableHead>
                    <TableHead>Date et heure</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Prochain rappel</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appels?.map((appel) => (
                    <TableRow key={appel.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span>{getClientName(appel.clientId)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDateTime(appel.dateAppel)}</TableCell>
                      <TableCell>{formatDuration(appel.duree)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(appel.statut)}
                          {getStatusBadge(appel.statut)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {appel.prochainRappel ? (
                          <span className="text-sm text-slate-600">
                            {formatDateTime(appel.prochainRappel)}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">Aucun</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleNewCall(appel.clientId)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {appels?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500">Aucun appel enregistré</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
