
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
    <Card className="h-full bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 flex flex-col">
      <CardHeader className="flex-shrink-0 pb-4 border-b border-slate-700/50">
        <CardTitle className="text-lg text-white font-semibold">Conversations</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-700/50 border border-slate-600/50 backdrop-blur-xl text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="h-full overflow-y-auto p-4 space-y-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.user_id}
                onClick={() => onSelectConversation(conversation.user_id)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-transparent hover:border-slate-600/50 ${
                  selectedConversation === conversation.user_id ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50 shadow-lg' : ''
                }`}
              >
                <Avatar className="h-12 w-12 border-2 border-slate-600/50">
                  {conversation.avatar_url ? (
                    <AvatarImage src={conversation.avatar_url} alt={conversation.username} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                      {conversation.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-white truncate text-sm">
                      {conversation.username}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 truncate mt-1">
                    {conversation.last_message}
                  </p>
                </div>
                {conversation.unread_count > 0 && (
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-1">
                    {conversation.unread_count}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">
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
