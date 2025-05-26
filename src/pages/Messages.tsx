import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
}

const Messages = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("messages");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserProfile }>({});

  const fetchFriends = async () => {
    try {
      const { data: friendships, error } = await supabase
        .from("friendships")
        .select("*")
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .eq("status", "accepted");

      if (error) throw error;

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

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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

  useEffect(() => {
    const fetchUserProfiles = async () => {
      if (messages.length > 0 && user) {
        const userIds = [...new Set([...messages.map(msg => msg.sender_id), user.id])];
        const missingUserIds = userIds.filter(id => !userProfiles[id]);
        
        if (missingUserIds.length > 0) {
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("id, username, avatar_url")
              .in("id", missingUserIds);

            if (error) throw error;

            const profilesMap = data.reduce((acc, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {} as { [key: string]: UserProfile });

            setUserProfiles(prev => ({ ...prev, ...profilesMap }));
          } catch (error) {
            console.error("Error fetching user profiles:", error);
          }
        }
      }
    };

    fetchUserProfiles();
  }, [messages, user]);

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0a0a12] via-[#1a1625] to-[#2a1f40]">
        <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
      </div>
    );
  }

  const markMessagesAsRead = async (partnerId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("sender_id", partnerId)
        .eq("receiver_id", user?.id)
        .eq("read", false);

      if (error) {
        console.error("Error marking messages as read:", error);
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setIsSending(true);
    
    try {
      const messageData = {
        sender_id: user.id,
        receiver_id: selectedConversation,
        content: newMessage.trim()
      };

      const { data, error } = await supabase
        .from("messages")
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      setNewMessage("");
      toast.success("Message envoyé");
      refetchConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Impossible d'envoyer le message");
    } finally {
      setIsSending(false);
    }
  };

  const startConversationWithFriend = async (friendId: string) => {
    const existingConv = conversations.find(conv => conv.user_id === friendId);
    
    if (!existingConv) {
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
    <div className="h-screen bg-gradient-to-br from-[#0a0a12] via-[#1a1625] to-[#2a1f40] overflow-hidden flex flex-col">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
        <div className="absolute w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-float" style={{ top: '60%', right: '10%', animationDelay: '3s' }}></div>
        <div className="absolute w-48 h-48 bg-indigo-500/8 rounded-full blur-2xl animate-float" style={{ bottom: '15%', left: '15%', animationDelay: '6s' }}></div>
        <div className="absolute w-24 h-24 bg-purple-600/12 rounded-full blur-2xl animate-float" style={{ top: '30%', right: '25%', animationDelay: '2s' }}></div>
        <div className="absolute w-36 h-36 bg-blue-600/8 rounded-full blur-2xl animate-float" style={{ bottom: '40%', right: '5%', animationDelay: '4s' }}></div>
      </div>

      {/* Header fixe */}
      <div className="relative z-10 flex-shrink-0 p-4 border-b border-white/15 bg-black/20 backdrop-blur-2xl">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-[#9b87f5] animate-glow" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600">
            Messagerie
          </h1>
        </div>
      </div>

      {/* Contenu principal avec hauteur calculée */}
      <div className="relative z-10 flex-1 min-h-0 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Navigation des tabs */}
          <div className="flex-shrink-0 bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 mb-4 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <TabsList className="grid w-full grid-cols-4 bg-transparent">
              <TabsTrigger 
                value="messages" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/40 data-[state=active]:to-blue-600/40 data-[state=active]:border-purple-500/60 data-[state=active]:text-white transition-all duration-300"
              >
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger 
                value="friends" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/40 data-[state=active]:to-blue-600/40 data-[state=active]:border-purple-500/60 data-[state=active]:text-white transition-all duration-300"
              >
                <Users className="h-4 w-4" />
                Amis ({friends.length})
              </TabsTrigger>
              <TabsTrigger 
                value="requests" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/40 data-[state=active]:to-blue-600/40 data-[state=active]:border-purple-500/60 data-[state=active]:text-white transition-all duration-300"
              >
                <UserPlus className="h-4 w-4" />
                Demandes
              </TabsTrigger>
              <TabsTrigger 
                value="add-friend" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/40 data-[state=active]:to-blue-600/40 data-[state=active]:border-purple-500/60 data-[state=active]:text-white transition-all duration-300"
              >
                <Search className="h-4 w-4" />
                Ajouter
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Contenu des tabs avec hauteur restante */}
          <div className="flex-1 min-h-0">
            <TabsContent value="messages" className="h-full m-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Liste des conversations */}
                <div className="lg:col-span-1">
                  <Card className="h-full bg-black/15 backdrop-blur-2xl border border-white/15 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02] flex flex-col">
                    <CardHeader className="flex-shrink-0 pb-4">
                      <CardTitle className="text-lg text-white">Conversations</CardTitle>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Rechercher..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-black/20 border border-white/15 backdrop-blur-xl text-white placeholder-white/50 focus:border-purple-500/50"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-0 p-0">
                      {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-[#9b87f5]" />
                        </div>
                      ) : filteredConversations.length > 0 ? (
                        <ScrollArea className="h-full">
                          <div className="p-4 space-y-2">
                            {filteredConversations.map((conversation) => (
                              <div
                                key={conversation.user_id}
                                onClick={() => setSelectedConversation(conversation.user_id)}
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-white/5 rounded-lg transition-all duration-300 ${
                                  selectedConversation === conversation.user_id ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30' : ''
                                }`}
                              >
                                <Avatar className="h-10 w-10">
                                  {conversation.avatar_url ? (
                                    <AvatarImage src={conversation.avatar_url} alt={conversation.username} />
                                  ) : (
                                    <AvatarFallback className="bg-purple-600/20 text-purple-300">
                                      {conversation.username.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="flex-grow min-w-0">
                                  <div className="flex justify-between items-center">
                                    <h3 className="font-medium text-white truncate">
                                      {conversation.username}
                                    </h3>
                                    <span className="text-xs text-gray-400">
                                      {formatTime(conversation.last_message_time)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-300 truncate">
                                    {conversation.last_message}
                                  </p>
                                </div>
                                {conversation.unread_count > 0 && (
                                  <Badge variant="default" className="bg-[#9b87f5] text-white text-xs">
                                    {conversation.unread_count}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-8">
                          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-400">
                            {searchQuery ? "Aucune conversation trouvée" : "Aucune conversation"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Zone de messages */}
                <div className="lg:col-span-2">
                  <Card className="h-full bg-black/15 backdrop-blur-2xl border border-white/15 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02] flex flex-col">
                    {selectedConversation && selectedUser ? (
                      <>
                        {/* Header de conversation */}
                        <CardHeader className="flex-shrink-0 border-b border-white/15 p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              {selectedUser.avatar_url ? (
                                <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.username} />
                              ) : (
                                <AvatarFallback className="bg-purple-600/20 text-purple-300">
                                  {selectedUser.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <h3 className="font-semibold text-white">
                              {selectedUser.username}
                            </h3>
                          </div>
                        </CardHeader>
                        
                        {/* Zone de messages avec scroll */}
                        <div className="flex-1 min-h-0">
                          {messagesLoading ? (
                            <div className="flex justify-center items-center h-full">
                              <Loader2 className="h-6 w-6 animate-spin text-[#9b87f5]" />
                            </div>
                          ) : (
                            <ScrollArea className="h-full">
                              <div className="p-4 space-y-4">
                                {messages.map((message) => {
                                  const isMyMessage = message.sender_id === user?.id;
                                  const senderProfile = userProfiles[message.sender_id];
                                  
                                  return (
                                    <div
                                      key={message.id}
                                      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} relative`}
                                    >
                                      <div className={`max-w-xs lg:max-w-md relative ${isMyMessage ? 'mr-8' : 'ml-8'}`}>
                                        <div
                                          className={`px-3 py-2 rounded-lg relative backdrop-blur-xl ${
                                            isMyMessage
                                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm shadow-lg'
                                              : 'bg-black/20 border border-white/15 text-white rounded-bl-sm'
                                          }`}
                                        >
                                          <p className={`text-xs font-semibold mb-1 ${
                                            isMyMessage 
                                              ? 'text-blue-200' 
                                              : 'text-blue-300'
                                          }`}>
                                            {senderProfile?.username || 'Chargement...'}
                                          </p>
                                          <p className="text-sm break-words">{message.content}</p>
                                          <p className={`text-xs mt-1 ${
                                            isMyMessage
                                              ? 'text-white/70'
                                              : 'text-gray-400'
                                          }`}>
                                            {formatTime(message.created_at)}
                                          </p>
                                        </div>
                                        
                                        <Avatar className={`h-6 w-6 absolute bottom-0 ${
                                          isMyMessage ? '-right-7' : '-left-7'
                                        }`}>
                                          {senderProfile?.avatar_url ? (
                                            <AvatarImage src={senderProfile.avatar_url} alt={senderProfile.username} />
                                          ) : (
                                            <AvatarFallback className="bg-purple-600/20 text-purple-300 text-xs">
                                              {senderProfile?.username?.substring(0, 2).toUpperCase() || '??'}
                                            </AvatarFallback>
                                          )}
                                        </Avatar>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          )}
                        </div>
                        
                        {/* Zone d'envoi FIXE */}
                        <div className="flex-shrink-0 p-4 border-t border-white/15">
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
                              className="flex-grow resize-none bg-black/20 border border-white/15 backdrop-blur-xl text-white placeholder-white/50 focus:border-purple-500/50 min-h-[40px] max-h-[100px]"
                              rows={1}
                            />
                            <Button
                              onClick={sendMessage}
                              disabled={!newMessage.trim() || isSending}
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white self-end"
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
                          <h3 className="text-lg font-medium text-white mb-2">
                            Sélectionnez une conversation
                          </h3>
                          <p className="text-gray-400">
                            Choisissez une conversation pour commencer à échanger
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="friends" className="h-full m-0">
              <Card className="h-full flex flex-col bg-black/15 backdrop-blur-2xl border border-white/15 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02]">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5" />
                    Mes amis ({friends.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 p-6">
                  {friends.length > 0 ? (
                    <ScrollArea className="h-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {friends.map((friend) => (
                          <div
                            key={friend.id}
                            className="flex items-center justify-between p-4 border border-white/15 rounded-lg bg-black/20 backdrop-blur-xl hover:bg-white/5 transition-all duration-300"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                {friend.avatar_url ? (
                                  <AvatarImage src={friend.avatar_url} />
                                ) : (
                                  <AvatarFallback className="bg-purple-600/20 text-purple-300">
                                    {friend.username.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="font-medium text-white">{friend.username}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => startConversationWithFriend(friend.user_id)}
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-400">
                        Vous n'avez pas encore d'amis
                      </p>
                      <Button 
                        className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white" 
                        onClick={() => setActiveTab("add-friend")}
                      >
                        Ajouter des amis
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="h-full m-0">
              <div className="h-full">
                <FriendRequests />
              </div>
            </TabsContent>

            <TabsContent value="add-friend" className="h-full m-0">
              <div className="h-full">
                <AddFriend />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Messages;
