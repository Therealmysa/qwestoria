
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const useReferrals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Récupérer les informations de parrainage de l'utilisateur
  const { data: userReferrals, isLoading } = useQuery({
    queryKey: ["referrals", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("referrals")
        .select(`
          *,
          referred:profiles!referrals_referred_id_fkey(username)
        `)
        .eq("referrer_id", user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Récupérer le code de parrainage de l'utilisateur
  const { data: userProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Générer un code de parrainage si l'utilisateur n'en a pas
  const generateReferralCode = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const referralCode = `${user.email?.split('@')[0]?.toUpperCase() || 'USER'}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const { error } = await supabase
        .from("profiles")
        .update({ referral_code: referralCode })
        .eq("id", user.id);

      if (error) throw error;
      return referralCode;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Code de parrainage généré avec succès !");
    },
    onError: (error) => {
      console.error("Error generating referral code:", error);
      toast.error("Erreur lors de la génération du code de parrainage");
    },
  });

  const copyReferralLink = (referralCode: string) => {
    const link = `${window.location.origin}/auth?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Lien de parrainage copié !");
  };

  return {
    userReferrals,
    userProfile,
    isLoading,
    generateReferralCode: generateReferralCode.mutate,
    isGenerating: generateReferralCode.isPending,
    copyReferralLink,
  };
};
