
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
      
      // Récupérer directement le solde depuis la table brad_coins
      const { data, error } = await supabase
        .from('brad_coins')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching BradCoins:', error);
        // Si erreur, essayer de créer un compte
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
      }
      
      if (!data) {
        // Aucun enregistrement trouvé, créer un compte
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
      }
      
      console.log('BradCoins balance fetched:', data.balance);
      return data.balance || 0;
    },
    enabled: !!user?.id,
    staleTime: 0, // Toujours refetch pour éviter les données obsolètes
    gcTime: 0, // Ne pas mettre en cache
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return {
    balance,
    isLoading,
    error,
    refetch
  };
};
