
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export const useBradCoins = () => {
  const { user } = useAuth();

  const { data: balance = 0, isLoading, error, refetch } = useQuery({
    queryKey: ['brad-coins-balance', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for BradCoins fetch');
        return 0;
      }
      
      console.log('Fetching BradCoins balance for user:', user.id);
      
      // D'abord vérifier si l'utilisateur a un compte BradCoins
      const { data, error } = await supabase
        .from('brad_coins')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Aucun enregistrement trouvé, créer un compte avec 0 BradCoins
          console.log('No BradCoins account found, creating one...');
          
          const { data: newAccount, error: createError } = await supabase
            .from('brad_coins')
            .insert({ user_id: user.id, balance: 0 })
            .select('balance')
            .single();
          
          if (createError) {
            console.error('Error creating BradCoins account:', createError);
            return 0;
          }
          
          console.log('BradCoins account created with balance:', newAccount?.balance || 0);
          return newAccount?.balance || 0;
        } else {
          console.error('Error fetching BradCoins:', error);
          return 0;
        }
      }
      
      console.log('BradCoins balance fetched:', data?.balance || 0);
      return data?.balance || 0;
    },
    enabled: !!user?.id,
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  return {
    balance,
    isLoading,
    error,
    refetch
  };
};
