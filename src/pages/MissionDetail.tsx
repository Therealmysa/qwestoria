
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Coins, Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const MissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [fortniteUsername, setFortniteUsername] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: mission, isLoading: isLoadingMission } = useQuery({
    queryKey: ['mission', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    }
  });

  const { data: existingSubmission } = useQuery({
    queryKey: ['mission-submission', id, user?.id],
    queryFn: async () => {
      if (!user?.id || !id) return null;
      const { data, error } = await supabase
        .from('mission_submissions')
        .select('*')
        .eq('mission_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!id
  });

  const submitMissionMutation = useMutation({
    mutationFn: async ({ missionId, fortniteUsername, proofFile }: { 
      missionId: string, 
      fortniteUsername: string, 
      proofFile: File | null 
    }) => {
      let screenshotUrl = null;

      // Upload proof file if provided
      if (proofFile) {
        const fileExt = proofFile.name.split('.').pop();
        const fileName = `${user?.id}-${missionId}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('mission-proofs')
          .upload(fileName, proofFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('mission-proofs')
          .getPublicUrl(uploadData.path);

        screenshotUrl = urlData.publicUrl;
      }

      // Submit the mission
      const { data, error } = await supabase
        .from('mission_submissions')
        .insert([{
          user_id: user?.id,
          mission_id: missionId,
          fortnite_username: fortniteUsername,
          screenshot_url: screenshotUrl,
          status: 'pending'
        }]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mission-submission'] });
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      toast.success("Mission soumise avec succès ! En attente de validation.");
      navigate('/missions');
    },
    onError: (error) => {
      console.error('Error submitting mission:', error);
      toast.error("Erreur lors de la soumission de la mission.");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mission || !user) return;

    if (!fortniteUsername.trim()) {
      toast.error("Veuillez entrer votre pseudo Fortnite.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitMissionMutation.mutateAsync({
        missionId: mission.id,
        fortniteUsername: fortniteUsername.trim(),
        proofFile
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Le fichier ne doit pas dépasser 10MB.");
        return;
      }
      setProofFile(file);
    }
  };

  if (isLoadingMission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-50 to-amber-100 dark:from-amber-900 dark:via-amber-800 dark:to-amber-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
            <p className="text-sm">Chargement de la mission...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-50 to-amber-100 dark:from-amber-900 dark:via-amber-800 dark:to-amber-900">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">Mission non trouvée.</p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/missions')}
                className="mt-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux missions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">En attente de validation</Badge>;
      case 'verified':
        return <Badge className="bg-green-500">Validée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejetée</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-amber-50 to-amber-100 dark:from-amber-900 dark:via-amber-800 dark:to-amber-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/missions')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux missions
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mission Details */}
            <div className="lg:col-span-2">
              <Card className="dark:bg-amber-800/20 dark:backdrop-blur-xl dark:border dark:border-amber-500/20 bg-white/90 backdrop-blur-md shadow-xl dark:shadow-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-500">
                    {mission.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    {mission.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        {mission.reward_coins} BradCoins
                      </span>
                    </div>
                    {mission.is_vip_only && (
                      <Badge variant="secondary">VIP uniquement</Badge>
                    )}
                  </div>

                  {mission.external_link && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-500/30">
                      <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                        Cette mission nécessite une action externe :
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(mission.external_link, '_blank')}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ouvrir le lien
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Début: {new Date(mission.starts_at).toLocaleDateString()}
                      {mission.ends_at && (
                        <> • Fin: {new Date(mission.ends_at).toLocaleDateString()}</>
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submission Form */}
            <div>
              <Card className="dark:bg-amber-800/20 dark:backdrop-blur-xl dark:border dark:border-amber-500/20 bg-white/90 backdrop-blur-md shadow-xl dark:shadow-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-700 dark:text-amber-300">
                    {existingSubmission ? 'Votre Soumission' : 'Soumettre la Mission'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {existingSubmission ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Statut:</p>
                        {getStatusBadge(existingSubmission.status)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Pseudo Fortnite:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{existingSubmission.fortnite_username}</p>
                      </div>
                      {existingSubmission.admin_notes && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes de l'admin:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                            {existingSubmission.admin_notes}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Soumise le {new Date(existingSubmission.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="fortnite-username">Pseudo Fortnite *</Label>
                        <Input
                          id="fortnite-username"
                          type="text"
                          value={fortniteUsername}
                          onChange={(e) => setFortniteUsername(e.target.value)}
                          placeholder="Votre pseudo Fortnite"
                          required
                          className="dark:bg-amber-900/20 bg-amber-50/70 backdrop-blur-sm border-amber-200 dark:border-amber-500/30"
                        />
                      </div>

                      <div>
                        <Label htmlFor="proof-file">Preuve (optionnel)</Label>
                        <Input
                          id="proof-file"
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*,.pdf,.doc,.docx"
                          className="dark:bg-amber-900/20 bg-amber-50/70 backdrop-blur-sm border-amber-200 dark:border-amber-500/30"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Images, PDF ou documents (max 10MB)
                        </p>
                      </div>

                      {proofFile && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-500/30">
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Fichier sélectionné: {proofFile.name}
                          </p>
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        disabled={isSubmitting || !fortniteUsername.trim()}
                        className="w-full dark:bg-amber-700/50 dark:hover:bg-amber-700/70 bg-amber-100/70 hover:bg-amber-200/90 backdrop-blur-sm border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-300"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            Soumission...
                          </div>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Soumettre la Mission
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;
