import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from 'lucide-react';

interface ImportClientsModalProps {
  open: boolean;
  onClose: () => void;
}

interface ImportResult {
  message: string;
  importedCount: number;
  errorCount: number;
  clients: any[];
  errors: Array<{
    ligne: number;
    erreur: string;
  }>;
}

export function ImportClientsModal({ open, onClose }: ImportClientsModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/clients/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'import');
      }

      return response.json();
    },
    onSuccess: (data: ImportResult) => {
      setImportResult(data);
      setShowResults(true);
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      
      toast({
        title: "Import terminé",
        description: `${data.importedCount} clients importés avec succès`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur d'import",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                         'application/vnd.ms-excel', 
                         'text/csv'];
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Format non supporté",
          description: "Seuls les fichiers .xlsx, .xls et .csv sont acceptés",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (!selectedFile) return;
    importMutation.mutate(selectedFile);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    setShowResults(false);
    onClose();
  };

  const downloadTemplate = () => {
    const template = `nom,prenom,email,telephone,date_naissance,numero_secu,adresse,situation_familiale,nombre_ayants_droit,mutuelle_actuelle,niveau_couverture,statut,notes
Dupont,Jean,jean.dupont@email.com,0123456789,1980-01-15,1234567890123,123 Rue de la Paix 75001 Paris,marie,2,Harmonie Mutuelle,standard,prospect,Premier contact
Martin,Marie,marie.martin@email.com,0987654321,1985-05-20,2345678901234,456 Avenue des Champs 69000 Lyon,celibataire,0,MGEN,premium,client,Client fidèle`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_import_clients.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import de Portefeuille Client
          </DialogTitle>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructions d'import</CardTitle>
                <CardDescription>
                  Importez votre portefeuille client depuis un fichier Excel ou CSV
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Formats supportés :</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Fichiers Excel (.xlsx, .xls)</li>
                      <li>• Fichiers CSV (.csv)</li>
                      <li>• Taille maximale : 10MB</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Colonnes reconnues :</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• nom, prenom, email, telephone</li>
                      <li>• date_naissance, numero_secu</li>
                      <li>• adresse, situation_familiale</li>
                      <li>• mutuelle_actuelle, statut, notes</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={downloadTemplate}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger le modèle CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sélection de fichier */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Sélectionner un fichier</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="mt-2"
                />
              </div>

              {selectedFile && (
                <Alert>
                  <FileSpreadsheet className="h-4 w-4" />
                  <AlertDescription>
                    Fichier sélectionné : {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button 
                onClick={handleImport}
                disabled={!selectedFile || importMutation.isPending}
                className="flex items-center gap-2"
              >
                {importMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Import en cours...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Importer
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Résultats de l'import
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Résultats de l'import
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {importResult?.importedCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Clients importés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {importResult?.errorCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Erreurs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {(importResult?.importedCount || 0) + (importResult?.errorCount || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total traité</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Erreurs */}
            {importResult?.errors && importResult.errors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Erreurs d'import
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertDescription>
                          <span className="font-medium">Ligne {error.ligne}:</span> {error.erreur}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Clients importés */}
            {importResult?.clients && importResult.clients.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Clients importés avec succès</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {importResult.clients.map((client, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{client.nom} {client.prenom}</div>
                          <div className="text-sm text-gray-600">{client.email}</div>
                        </div>
                        <Badge variant="secondary">{client.statut}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button onClick={handleClose}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}