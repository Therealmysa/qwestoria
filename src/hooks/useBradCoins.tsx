
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export const useBradCoins = () => {
  const { user } = useAuth();

  const { data: balance = 0, isLoading, error, refetch } = useQuery({
    queryKey: ['brad-coins-balance', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      console.log('Fetching BradCoins balance for user:', user.id);
      const { data, error } = await supabase
        .from('brad_coins')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching BradCoins:', error);
        return 0;
      }
      
      console.log('BradCoins balance fetched:', data?.balance || 0);
      return data?.balance || 0;
    },
    enabled: !!user?.id,
    staleTime: 0, // Toujours refetch pour avoir les données les plus récentes
  });

  return {
    balance,
    isLoading,
    error,
    refetch
  };
};
