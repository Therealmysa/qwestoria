
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
    <Card className="h-full bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl hover:shadow-blue-200/50 transition-all duration-300 flex flex-col">
      <CardHeader className="flex-shrink-0 pb-4 border-b border-gray-200/50">
        <CardTitle className="text-lg text-gray-800 font-semibold">Conversations</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50/80 border border-gray-300/50 backdrop-blur-xl text-gray-800 placeholder-gray-500 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="h-full overflow-y-auto p-4 space-y-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.user_id}
                onClick={() => onSelectConversation(conversation.user_id)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-blue-50/80 rounded-xl transition-all duration-300 border border-transparent hover:border-blue-200/50 ${
                  selectedConversation === conversation.user_id ? 'bg-gradient-to-r from-blue-100/80 to-cyan-100/80 border-blue-300/50 shadow-lg' : ''
                }`}
              >
                <Avatar className="h-12 w-12 border-2 border-gray-300/50">
                  {conversation.avatar_url ? (
                    <AvatarImage src={conversation.avatar_url} alt={conversation.username} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold">
                      {conversation.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 truncate text-sm">
                      {conversation.username}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.last_message}
                  </p>
                </div>
                {conversation.unread_count > 0 && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-2 py-1">
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
              <p className="text-gray-500">
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
