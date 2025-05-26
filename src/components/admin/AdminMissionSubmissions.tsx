
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye, MessageSquare, ExternalLink } from "lucide-react";
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

      // Si validé, ajouter les BradCoins et créer une transaction
      if (status === 'verified') {
        const submission = submissions?.find(s => s.id === submissionId);
        if (submission) {
          // Ajouter les BradCoins
          const { error: coinsError } = await supabase.rpc('update_bradcoins_balance', {
            user_id: submission.user_id,
            amount: submission.missions.reward_coins
          });

          if (coinsError) throw coinsError;

          // Créer une transaction
          await supabase.from('transactions').insert({
            user_id: submission.user_id,
            amount: submission.missions.reward_coins,
            type: 'mission_reward',
            description: `Récompense pour la mission: ${submission.missions.title}`
          });
        }
      }

      // Log admin action
      await supabase.from('admin_logs').insert({
        admin_id: (await supabase.auth.getUser()).data.user?.id,
        action: `${status}_mission_submission`,
        target_type: 'mission_submission',
        target_id: submissionId,
        details: { notes }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-mission-submissions'] });
      toast.success("Soumission mise à jour");
      setShowDetailsDialog(false);
      setAdminNotes("");
    },
    onError: () => {
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
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>
                    {new Date(submission.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails de la soumission</DialogTitle>
                          </DialogHeader>
                          {selectedSubmission && (
                            <div className="space-y-4">
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
                                <div>
                                  <strong>Preuve:</strong>
                                  <div className="mt-2">
                                    <img 
                                      src={selectedSubmission.screenshot_url} 
                                      alt="Screenshot de preuve"
                                      className="max-w-full h-auto rounded-lg border"
                                    />
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="mt-2"
                                      onClick={() => window.open(selectedSubmission.screenshot_url, '_blank')}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Voir en grand
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {selectedSubmission.admin_notes && (
                                <div>
                                  <strong>Notes administrateur:</strong>
                                  <p className="text-sm text-gray-600 mt-1">{selectedSubmission.admin_notes}</p>
                                </div>
                              )}

                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  Notes administrateur (optionnel):
                                </label>
                                <Textarea
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Ajoutez vos commentaires..."
                                  className="min-h-[80px]"
                                />
                              </div>

                              {selectedSubmission.status === 'pending' && (
                                <div className="flex space-x-2 pt-4">
                                  <Button 
                                    onClick={() => handleApprove(selectedSubmission.id)}
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Valider
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleReject(selectedSubmission.id)}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Rejeter
                                  </Button>
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
