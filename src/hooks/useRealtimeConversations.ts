
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Conversation {
  user_id: string;
  username: string;
  avatar_url: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const useRealtimeConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Grouper les messages par partenaire de conversation
      const conversationMap = new Map<string, Conversation>();
      const profilesCache = new Map<string, any>();
      
      for (const message of messagesData || []) {
        const partnerId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        
        if (!conversationMap.has(partnerId)) {
          // Récupérer le profil utilisateur pour ce partenaire s'il n'est pas en cache
          if (!profilesCache.has(partnerId)) {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", partnerId)
              .single();
            
            profilesCache.set(partnerId, profileData);
          }
          
          const profile = profilesCache.get(partnerId);
          
          conversationMap.set(partnerId, {
            user_id: partnerId,
            username: profile?.username || "Utilisateur",
            avatar_url: profile?.avatar_url || null,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: message.receiver_id === user.id && !message.read ? 1 : 0
          });
        } else {
          const conv = conversationMap.get(partnerId)!;
          if (message.receiver_id === user.id && !message.read) {
            conv.unread_count++;
          }
        }
      }

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Impossible de charger les conversations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchConversations();

    // Configuration du canal en temps réel pour les nouveaux messages
    const channel = supabase
      .channel(`conversations-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
        },
        () => {
          // Actualiser les conversations quand un nouveau message arrive
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`
        },
        () => {
          // Actualiser les conversations quand un message est lu
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { conversations, isLoading, refetchConversations: fetchConversations };
};
