
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Send,
  Search,
  User,
  Clock,
  Loader2,
  Mail,
  MailOpen,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_id: string;
  receiver_id: string;
}

interface Conversation {
  user_id: string;
  username: string;
  avatar_url: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

const Messages = () => {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      markMessagesAsRead(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      // This is a simplified approach - in a real app you'd want to optimize this query
      const { data: messagesData, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      for (const message of messagesData) {
        const partnerId = message.sender_id === user?.id ? message.receiver_id : message.sender_id;
        
        if (!conversationMap.has(partnerId)) {
          // Fetch user profile for this partner
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", partnerId)
            .single();
          
          conversationMap.set(partnerId, {
            user_id: partnerId,
            username: profileData?.username || "Utilisateur",
            avatar_url: profileData?.avatar_url || null,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: message.receiver_id === user?.id && !message.read ? 1 : 0
          });
        } else {
          const conv = conversationMap.get(partnerId)!;
          if (message.receiver_id === user?.id && !message.read) {
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

  const fetchMessages = async (partnerId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user?.id})`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data as Message[]);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Impossible de charger les messages");
    }
  };

  const markMessagesAsRead = async (partnerId: string) => {
    try {
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("sender_id", partnerId)
        .eq("receiver_id", user?.id)
        .eq("read", false);
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.user_id === partnerId 
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            sender_id: user.id,
            receiver_id: selectedConversation,
            content: newMessage.trim()
          }
        ]);

      if (error) throw error;

      setNewMessage("");
      fetchMessages(selectedConversation);
      fetchConversations(); // Refresh conversations to update last message
      toast.success("Message envoyé");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Impossible d'envoyer le message");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUser = conversations.find(conv => conv.user_id === selectedConversation);

  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-200px)]">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-8 w-8 text-primary dark:text-[#9b87f5]" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-[#9b87f5]">
          Messagerie
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Conversations List */}
        <Card className="lg:col-span-1 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#221F26]">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-gray-800 dark:text-white">Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary dark:text-[#9b87f5]" />
              </div>
            ) : filteredConversations.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.user_id}
                    onClick={() => setSelectedConversation(conversation.user_id)}
                    className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 transition-colors ${
                      selectedConversation === conversation.user_id ? 'bg-primary/5 dark:bg-[#9b87f5]/10' : ''
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      {conversation.avatar_url ? (
                        <AvatarImage src={conversation.avatar_url} alt={conversation.username} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 dark:bg-[#9b87f5]/20 text-primary dark:text-[#9b87f5]">
                          {conversation.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-800 dark:text-white truncate">
                          {conversation.username}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(conversation.last_message_time)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {conversation.last_message}
                      </p>
                    </div>
                    {conversation.unread_count > 0 && (
                      <Badge variant="default" className="bg-primary dark:bg-[#9b87f5] text-white text-xs">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? "Aucune conversation trouvée" : "Aucune conversation"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#221F26] flex flex-col">
          {selectedConversation && selectedUser ? (
            <>
              <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {selectedUser.avatar_url ? (
                      <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.username} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 dark:bg-[#9b87f5]/20 text-primary dark:text-[#9b87f5]">
                        {selectedUser.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {selectedUser.username}
                  </h3>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow overflow-y-auto p-4 max-h-96">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-primary dark:bg-[#9b87f5] text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === user?.id
                            ? 'text-white/70'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="flex-grow resize-none"
                    rows={1}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#8976e4]"
                  >
                    {isSending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choisissez une conversation pour commencer à échanger
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
