
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export const useBradCoins = () => {
  const { user } = useAuth();

  const { data: balance = 0, isLoading, error, refetch } = useQuery({
    queryKey: ['brad-coins-balance', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ useBradCoins: No user ID available');
        return 0;
      }
      
      console.log('🔍 useBradCoins: Fetching BradCoins for user:', user.id);
      
      try {
        // Récupérer le solde depuis la table brad_coins
        const { data, error } = await supabase
          .from('brad_coins')
          .select('balance, last_updated')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('❌ useBradCoins: Error fetching BradCoins:', error);
          
          // Si l'erreur est "pas de résultat trouvé", créer un compte
          if (error.code === 'PGRST116') {
            console.log('📝 useBradCoins: No account found, creating one...');
            
            const { data: newAccount, error: createError } = await supabase
              .from('brad_coins')
              .insert({ user_id: user.id, balance: 0 })
              .select('balance')
              .single();
            
            if (createError) {
              console.error('❌ useBradCoins: Error creating account:', createError);
              return 0;
            }
            
            console.log('✅ useBradCoins: Account created with balance:', newAccount.balance);
            return newAccount.balance || 0;
          }
          
          // Autre erreur
          console.error('❌ useBradCoins: Database error:', error);
          return 0;
        }
        
        if (!data) {
          console.log('⚠️ useBradCoins: No data returned but no error');
          return 0;
        }
        
        console.log('✅ useBradCoins: Successfully fetched balance:', data.balance);
        console.log('📊 useBradCoins: Last updated:', data.last_updated);
        
        return data.balance || 0;
        
      } catch (catchError) {
        console.error('❌ useBradCoins: Caught error:', catchError);
        return 0;
      }
    },
    enabled: !!user?.id,
    staleTime: 0, // Toujours refetch
    gcTime: 0, // Ne pas mettre en cache
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
    retryDelay: 1000,
  });

  // Log des états du hook
  console.log('📊 useBradCoins hook state:', {
    userId: user?.id,
    balance,
    isLoading,
    error: error?.message,
  });

  return {
    balance,
    isLoading,
    error,
    refetch
  };
};
