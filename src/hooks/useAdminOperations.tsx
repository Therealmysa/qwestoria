
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminOperations = () => {
  const queryClient = useQueryClient();

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ 
      userId, 
      isAdmin, 
      isVip 
    }: { 
      userId: string; 
      isAdmin?: boolean; 
      isVip?: boolean; 
    }) => {
      console.log('Updating user status:', { userId, isAdmin, isVip });
      
      const { data, error } = await supabase.rpc('admin_update_user_status', {
        target_user_id: userId,
        new_is_admin: isAdmin,
        new_is_vip: isVip
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success("Statut utilisateur mis à jour avec succès");
    },
    onError: (error: any) => {
      console.error('Error updating user status:', error);
      if (error.message.includes('Unauthorized')) {
        toast.error("Accès non autorisé : droits administrateur requis");
      } else if (error.message.includes('Cannot modify owner account')) {
        toast.error("Impossible de modifier un compte propriétaire");
      } else if (error.message.includes('Only owners can modify admin status')) {
        toast.error("Seuls les propriétaires peuvent modifier le statut administrateur");
      } else {
        toast.error("Erreur lors de la mise à jour du statut");
      }
    }
  });

  const deleteMissionMutation = useMutation({
    mutationFn: async (missionId: string) => {
      console.log('Deleting mission:', missionId);
      
      const { data, error } = await supabase.rpc('admin_delete_mission', {
        mission_id: missionId
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-missions'] });
      toast.success("Mission supprimée avec succès");
    },
    onError: (error: any) => {
      console.error('Error deleting mission:', error);
      if (error.message.includes('Unauthorized')) {
        toast.error("Accès non autorisé : droits administrateur requis");
      } else {
        toast.error("Erreur lors de la suppression de la mission");
      }
    }
  });

  return {
    updateUserStatus: updateUserStatusMutation.mutate,
    isUpdatingUserStatus: updateUserStatusMutation.isPending,
    deleteMission: deleteMissionMutation.mutate,
    isDeletingMission: deleteMissionMutation.isPending
  };
};
