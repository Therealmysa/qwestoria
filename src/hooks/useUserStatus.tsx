
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserStatus = () => {
  const { data: userStatus, isLoading } = useQuery({
    queryKey: ['user-status'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Récupérer le profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_vip, is_admin, is_owner')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Vérifier s'il a un abonnement actif
      const { data: subscription, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('status, expires_at')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .maybeSingle();

      if (subscriptionError) throw subscriptionError;

      return {
        ...profile,
        hasActiveSubscription: !!subscription,
        subscriptionExpiresAt: subscription?.expires_at
      };
    },
    enabled: true
  });

  return {
    isVip: userStatus?.is_vip || false,
    isAdmin: userStatus?.is_admin || false,
    isOwner: userStatus?.is_owner || false,
    isPremium: userStatus?.hasActiveSubscription || false,
    subscriptionExpiresAt: userStatus?.subscriptionExpiresAt,
    isLoading
  };
};
