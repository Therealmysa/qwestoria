
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReferralData {
  id: string;
  referrer_id: string;
  referred_id: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
  completed_at?: string;
  reward_claimed: boolean;
  referred_profile?: {
    username: string;
    avatar_url?: string;
  };
}

interface ReferralStats {
  total_referrals: number;
  completed_referrals: number;
  pending_referrals: number;
  total_rewards: number;
}

export const useReferrals = () => {
  const queryClient = useQueryClient();

  // Récupérer le code de parrainage de l'utilisateur
  const { data: userReferralCode, isLoading: isLoadingCode } = useQuery({
    queryKey: ['user-referral-code'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data.referral_code;
    }
  });

  // Récupérer les parrainages de l'utilisateur
  const { data: referrals = [], isLoading: isLoadingReferrals } = useQuery({
    queryKey: ['user-referrals'],
    queryFn: async (): Promise<ReferralData[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referred_profile:profiles!referrals_referred_id_fkey(username, avatar_url)
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure status is properly typed
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'completed' | 'expired'
      }));
    }
  });

  // Calculer les statistiques
  const stats: ReferralStats = {
    total_referrals: referrals.length,
    completed_referrals: referrals.filter(r => r.status === 'completed').length,
    pending_referrals: referrals.filter(r => r.status === 'pending').length,
    total_rewards: referrals.filter(r => r.reward_claimed).length * 100, // 100 BradCoins par parrainage
  };

  // Valider un code de parrainage
  const validateReferralCode = useMutation({
    mutationFn: async (code: string) => {
      if (!code.trim()) throw new Error('Code de parrainage requis');

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('referral_code', code.trim().toUpperCase())
        .single();

      if (error || !data) throw new Error('Code de parrainage invalide');
      return data;
    }
  });

  return {
    userReferralCode,
    referrals,
    stats,
    isLoadingCode,
    isLoadingReferrals,
    validateReferralCode,
    refetchReferrals: () => queryClient.invalidateQueries({ queryKey: ['user-referrals'] }),
  };
};
