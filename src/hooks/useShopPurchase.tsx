
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PurchaseShopItemParams {
  itemId: string;
  quantity?: number;
}

export const useShopPurchase = () => {
  const queryClient = useQueryClient();

  const purchaseMutation = useMutation({
    mutationFn: async ({ itemId, quantity = 1 }: PurchaseShopItemParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      // Appeler la fonction Supabase pour traiter l'achat
      const { data, error } = await supabase.rpc('process_shop_purchase', {
        p_user_id: user.id,
        p_item_id: itemId,
        p_quantity: quantity
      });

      if (error) throw error;
      if (!data) throw new Error('Échec de l\'achat');

      return data;
    },
    onSuccess: () => {
      // Invalider les requêtes pour mettre à jour les données
      queryClient.invalidateQueries({ queryKey: ['user-coins'] });
      queryClient.invalidateQueries({ queryKey: ['shop-purchases'] });
      queryClient.invalidateQueries({ queryKey: ['shop-items'] });
      toast.success("Achat effectué avec succès !");
    },
    onError: (error: any) => {
      console.error('Erreur lors de l\'achat:', error);
      if (error.message.includes('Solde insuffisant')) {
        toast.error("Solde insuffisant pour cet achat");
      } else if (error.message.includes('Article non trouvé')) {
        toast.error("Cet article n'est plus disponible");
      } else {
        toast.error("Erreur lors de l'achat. Veuillez réessayer.");
      }
    }
  });

  return {
    purchaseItem: purchaseMutation.mutate,
    isPurchasing: purchaseMutation.isPending
  };
};
