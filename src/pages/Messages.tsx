
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Search,
  Loader2,
  UserPlus,
  Users,
} from "lucide-react";
import FriendRequests from "@/components/messages/FriendRequests";
import AddFriend from "@/components/messages/AddFriend";
import MessagesHeader from "@/components/messages/MessagesHeader";
import ConversationList from "@/components/messages/ConversationList";
import MessageArea from "@/components/messages/MessageArea";
import FriendsList from "@/components/messages/FriendsList";
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

  const selectedUser = conversations.find(conv => conv.user_id === selectedConversation);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a12] via-[#1a1625] to-[#2a1f40] flex flex-col overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
        <div className="absolute w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-float" style={{ top: '60%', right: '10%', animationDelay: '3s' }}></div>
        <div className="absolute w-48 h-48 bg-indigo-500/8 rounded-full blur-2xl animate-float" style={{ bottom: '15%', left: '15%', animationDelay: '6s' }}></div>
        <div className="absolute w-24 h-24 bg-purple-600/12 rounded-full blur-2xl animate-float" style={{ top: '30%', right: '25%', animationDelay: '2s' }}></div>
        <div className="absolute w-36 h-36 bg-blue-600/8 rounded-full blur-2xl animate-float" style={{ bottom: '40%', right: '5%', animationDelay: '4s' }}></div>
      </div>

      <MessagesHeader />

      <div className="relative z-10 flex-1 min-h-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Navigation des tabs - hauteur fixe 100px */}
          <div className="h-24 flex-shrink-0 p-4">
            <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
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
          </div>

          <div className="flex-1 min-h-0 p-4 overflow-hidden">
            <TabsContent value="messages" className="h-full m-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <div className="lg:col-span-1 h-full">
                  <ConversationList
                    conversations={conversations}
                    isLoading={isLoading}
                    selectedConversation={selectedConversation}
                    onSelectConversation={setSelectedConversation}
                    formatTime={formatTime}
                  />
                </div>
                <div className="lg:col-span-2 h-full">
                  <MessageArea
                    selectedConversation={selectedConversation}
                    selectedUser={selectedUser}
                    messages={messages}
                    messagesLoading={messagesLoading}
                    userProfiles={userProfiles}
                    user={user}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    isSending={isSending}
                    onSendMessage={sendMessage}
                    formatTime={formatTime}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="friends" className="h-full m-0 overflow-hidden">
              <FriendsList 
                friends={friends}
                onStartConversation={startConversationWithFriend}
                onSwitchToAddFriend={() => setActiveTab("add-friend")}
              />
            </TabsContent>

            <TabsContent value="requests" className="h-full m-0 overflow-hidden">
              <div className="h-full">
                <FriendRequests />
              </div>
            </TabsContent>

            <TabsContent value="add-friend" className="h-full m-0 overflow-hidden">
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
