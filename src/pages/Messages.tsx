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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Send,
  Search,
  Loader2,
  Mail,
  UserPlus,
  Users,
} from "lucide-react";
import FriendRequests from "@/components/messages/FriendRequests";
import AddFriend from "@/components/messages/AddFriend";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useRealtimeConversations } from "@/hooks/useRealtimeConversations";

interface Friend {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
}

const Messages = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("messages");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Utilisation des hooks temps réel
  const { conversations, isLoading, refetchConversations } = useRealtimeConversations();
  const { messages, isLoading: messagesLoading } = useRealtimeMessages(selectedConversation);

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      markMessagesAsRead(selectedConversation);
    }
  }, [selectedConversation, messages]);

  const fetchFriends = async () => {
    try {
      // Récupérer les amitiés acceptées
      const { data: friendships, error } = await supabase
        .from("friendships")
        .select("*")
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .eq("status", "accepted");

      if (error) throw error;

      // Récupérer les profils des amis
      const friendIds = friendships.map(friendship => 
        friendship.sender_id === user?.id ? friendship.receiver_id : friendship.sender_id
      );

      if (friendIds.length > 0) {
        const { data: friendProfiles, error: profileError } = await supabase
          .from("profiles")
          .select("id, username, avatar_url")
          .in("id", friendIds);

        if (profileError) throw profileError;

        const friendsData = friendProfiles.map(profile => ({
          id: profile.id,
          user_id: profile.id,
          username: profile.username,
          avatar_url: profile.avatar_url
        }));

        setFriends(friendsData);
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
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
      toast.success("Message envoyé");
      
      // Actualiser les conversations après l'envoi
      refetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Impossible d'envoyer le message");
    } finally {
      setIsSending(false);
    }
  };

  const startConversationWithFriend = async (friendId: string) => {
    // Vérifier si une conversation existe déjà
    const existingConv = conversations.find(conv => conv.user_id === friendId);
    
    if (!existingConv) {
      // Si aucune conversation n'existe, créer un message de bienvenue
      try {
        const { error } = await supabase
          .from("messages")
          .insert([
            {
              sender_id: user?.id,
              receiver_id: friendId,
              content: "Salut ! 👋"
            }
          ]);

        if (error) throw error;
        
        // Actualiser les conversations
        await refetchConversations();
        toast.success("Conversation créée");
      } catch (error) {
        console.error("Error creating conversation:", error);
        toast.error("Impossible de créer la conversation");
      }
    }
    
    setSelectedConversation(friendId);
    setActiveTab("messages");
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
    <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-120px)]">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-8 w-8 text-primary dark:text-[#9b87f5]" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-[#9b87f5]">
          Messagerie
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Amis ({friends.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Demandes
          </TabsTrigger>
          <TabsTrigger value="add-friend" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Ajouter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="mt-6 h-[calc(100vh-280px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Conversations List */}
            <Card className="lg:col-span-1 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#221F26] h-full">
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
              <CardContent className="p-0 h-[calc(100%-140px)]">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary dark:text-[#9b87f5]" />
                  </div>
                ) : filteredConversations.length > 0 ? (
                  <div className="h-full overflow-y-auto">
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
            <Card className="lg:col-span-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#221F26] flex flex-col h-full">
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
                  
                  <CardContent className="flex-grow overflow-y-auto p-4 h-[calc(100%-160px)]">
                    {messagesLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary dark:text-[#9b87f5]" />
                      </div>
                    ) : (
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
                    )}
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
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mes amis ({friends.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {friends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {friend.avatar_url ? (
                            <AvatarImage src={friend.avatar_url} />
                          ) : (
                            <AvatarFallback>
                              {friend.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{friend.username}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => startConversationWithFriend(friend.user_id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Vous n'avez pas encore d'amis
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setActiveTab("add-friend")}
                  >
                    Ajouter des amis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <FriendRequests />
        </TabsContent>

        <TabsContent value="add-friend" className="mt-6">
          <AddFriend />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
