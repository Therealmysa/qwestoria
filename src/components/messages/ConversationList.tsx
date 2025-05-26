
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Mail } from "lucide-react";

interface Conversation {
  user_id: string;
  username: string;
  avatar_url: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  selectedConversation: string | null;
  onSelectConversation: (userId: string) => void;
  formatTime: (dateString: string) => string;
}

const ConversationList = ({ 
  conversations, 
  isLoading, 
  selectedConversation, 
  onSelectConversation,
  formatTime 
}: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conv =>
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
          <div className="h-full overflow-y-auto p-4 space-y-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.user_id}
                onClick={() => onSelectConversation(conversation.user_id)}
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
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">
                {searchQuery ? "Aucune conversation trouvée" : "Aucune conversation"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationList;
