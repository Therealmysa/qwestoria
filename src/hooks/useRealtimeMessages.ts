
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_id: string;
  receiver_id: string;
}

export const useRealtimeMessages = (partnerId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!partnerId || !user) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    const fetchInitialMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data as Message[] || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMessages();

    // Configuration du canal en temps réel avec un nom unique
    // Créer un nom de canal consistant en triant les IDs
    const sortedIds = [user.id, partnerId].sort();
    const channelName = `messages-${sortedIds[0]}-${sortedIds[1]}`;
    console.log('Setting up realtime channel:', channelName);
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('New message received via realtime:', payload);
          const newMessage = payload.new as Message;
          
          // Vérifier si le message concerne cette conversation
          const isRelevantMessage = 
            (newMessage.sender_id === user.id && newMessage.receiver_id === partnerId) ||
            (newMessage.sender_id === partnerId && newMessage.receiver_id === user.id);
          
          if (isRelevantMessage) {
            setMessages(prev => {
              // Éviter les doublons
              if (prev.some(msg => msg.id === newMessage.id)) {
                console.log('Message already exists, skipping');
                return prev;
              }
              console.log('Adding new message to state');
              return [...prev, newMessage];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('Message updated via realtime:', payload);
          const updatedMessage = payload.new as Message;
          
          // Vérifier si le message concerne cette conversation
          const isRelevantMessage = 
            (updatedMessage.sender_id === user.id && updatedMessage.receiver_id === partnerId) ||
            (updatedMessage.sender_id === partnerId && updatedMessage.receiver_id === user.id);
          
          if (isRelevantMessage) {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime channel:', channelName);
      supabase.removeChannel(channel);
    };
  }, [partnerId, user]);

  return { messages, isLoading, setMessages };
};
