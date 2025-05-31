
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye, ExternalLink, FileImage, File } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminMissionSubmissions = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['admin-mission-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mission_submissions')
        .select(`
          *,
          missions(title, reward_coins),
          profiles(username, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const updateSubmissionMutation = useMutation({
    mutationFn: async ({ submissionId, status, notes }: { submissionId: string, status: string, notes?: string }) => {
      const updates: any = { status };
      if (notes) updates.admin_notes = notes;

      const { error } = await supabase
        .from('mission_submissions')
        .update(updates)
        .eq('id', submissionId);
      
      if (error) throw error;

      const submission = submissions?.find(s => s.id === submissionId);
      
      if (status === 'verified' && submission) {
        const { data: bradCoinsResult, error: coinsError } = await supabase.functions.invoke('update-bradcoins', {
          body: {
            user_id: submission.user_id,
            amount: submission.missions.reward_coins
          }
        });

        if (coinsError) {
          console.error('Error updating BradCoins:', coinsError);
          throw coinsError;
        }

        const { error: transactionError } = await supabase.from('transactions').insert({
          user_id: submission.user_id,
          amount: submission.missions.reward_coins,
          type: 'mission_reward',
          description: `Récompense pour la mission: ${submission.missions.title}`
        });

        if (transactionError) {
          console.error('Error creating transaction:', transactionError);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-mission-submissions'] });
      toast.success("Soumission mise à jour avec succès");
      setShowDetailsDialog(false);
      setAdminNotes("");
    },
    onError: (error) => {
      console.error('Error updating submission:', error);
      toast.error("Erreur lors de la mise à jour");
    }
  });

  const handleApprove = (submissionId: string) => {
    updateSubmissionMutation.mutate({ 
      submissionId, 
      status: 'verified', 
      notes: adminNotes 
    });
  };

  const handleReject = (submissionId: string) => {
    updateSubmissionMutation.mutate({ 
      submissionId, 
      status: 'rejected', 
      notes: adminNotes 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'verified':
        return <Badge className="bg-green-500">Validée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejetée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isImageFile = (url: string) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const getFileIcon = (url: string) => {
    return isImageFile(url) ? <FileImage className="h-4 w-4" /> : <File className="h-4 w-4" />;
  };

  const openDetailsDialog = (submission: any) => {
    setSelectedSubmission(submission);
    setAdminNotes(submission.admin_notes || "");
    setShowDetailsDialog(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des soumissions...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Validation des Missions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Mission</TableHead>
                <TableHead>Pseudo Fortnite</TableHead>
                <TableHead>Preuve</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions?.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {submission.profiles?.avatar_url && (
                        <img 
                          src={submission.profiles.avatar_url} 
                          alt="Avatar" 
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span>{submission.profiles?.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{submission.missions?.title}</div>
                      <div className="text-sm text-yellow-600">
                        {submission.missions?.reward_coins} BC
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{submission.fortnite_username}</TableCell>
                  <TableCell>
                    {submission.screenshot_url ? (
                      <div className="flex items-center gap-2">
                        {getFileIcon(submission.screenshot_url)}
                        <span className="text-sm text-green-600">Preuve fournie</span>
                      </div>
                    ) : (
                      <span className="text-sm text-red-600">Aucune preuve</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>
                    {new Date(submission.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog open={showDetailsDialog && selectedSubmission?.id === submission.id} onOpenChange={(open) => {
                        if (!open) {
                          setShowDetailsDialog(false);
                          setSelectedSubmission(null);
                          setAdminNotes("");
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openDetailsDialog(submission)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Détails de la soumission</DialogTitle>
                          </DialogHeader>
                          {selectedSubmission && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <strong>Mission:</strong> {selectedSubmission.missions?.title}
                                </div>
                                <div>
                                  <strong>Récompense:</strong> {selectedSubmission.missions?.reward_coins} BC
                                </div>
                                <div>
                                  <strong>Utilisateur:</strong> {selectedSubmission.profiles?.username}
                                </div>
                                <div>
                                  <strong>Pseudo Fortnite:</strong> {selectedSubmission.fortnite_username}
                                </div>
                              </div>
                              
                              {selectedSubmission.screenshot_url && (
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <strong>Preuve soumise:</strong>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => window.open(selectedSubmission.screenshot_url, '_blank')}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Ouvrir dans un nouvel onglet
                                    </Button>
                                  </div>
                                  
                                  {isImageFile(selectedSubmission.screenshot_url) ? (
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                      <img 
                                        src={selectedSubmission.screenshot_url} 
                                        alt="Preuve de la mission"
                                        className="max-w-full h-auto max-h-96 rounded-lg border shadow-sm mx-auto block"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                      />
                                      <div className="hidden text-center py-4">
                                        <File className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600">Impossible d'afficher l'image</p>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="mt-2"
                                          onClick={() => window.open(selectedSubmission.screenshot_url, '_blank')}
                                        >
                                          Voir le fichier
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="border rounded-lg p-6 bg-gray-50 text-center">
                                      <File className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                      <p className="text-sm text-gray-600 mb-3">Fichier non-image</p>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => window.open(selectedSubmission.screenshot_url, '_blank')}
                                      >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Télécharger/Voir le fichier
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {!selectedSubmission.screenshot_url && (
                                <div className="border rounded-lg p-6 bg-red-50 border-red-200">
                                  <div className="text-center">
                                    <XCircle className="h-12 w-12 mx-auto text-red-400 mb-2" />
                                    <p className="text-sm text-red-600 font-medium">Aucune preuve fournie</p>
                                    <p className="text-xs text-red-500 mt-1">L'utilisateur n'a pas uploadé de fichier de preuve</p>
                                  </div>
                                </div>
                              )}

                              {selectedSubmission.admin_notes && (
                                <div>
                                  <strong>Notes administrateur précédentes:</strong>
                                  <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-md">{selectedSubmission.admin_notes}</p>
                                </div>
                              )}

                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  Notes administrateur (optionnel):
                                </label>
                                <Textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Ajoutez vos commentaires sur cette soumission..."
                                  className="min-h-[100px]"
                                />
                              </div>

                              {selectedSubmission.status === 'pending' && (
                                <div className="flex space-x-3 pt-4 border-t">
                                  <Button 
                                    onClick={() => handleApprove(selectedSubmission.id)}
                                    className="bg-green-500 hover:bg-green-600 flex-1"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Valider et attribuer {selectedSubmission.missions?.reward_coins} BC
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleReject(selectedSubmission.id)}
                                    className="flex-1"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Rejeter la soumission
                                  </Button>
                                </div>
                              )}

                              {selectedSubmission.status !== 'pending' && (
                                <div className="pt-4 border-t">
                                  <p className="text-sm text-gray-600">
                                    Cette soumission a déjà été {selectedSubmission.status === 'verified' ? 'validée' : 'rejetée'}.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMissionSubmissions;
