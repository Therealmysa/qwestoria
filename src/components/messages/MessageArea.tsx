
import { useState, useRef, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender_id: string;
  receiver_id: string;
}

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface MessageAreaProps {
  selectedConversation: string | null;
  selectedUser: any;
  messages: Message[];
  messagesLoading: boolean;
  userProfiles: { [key: string]: UserProfile };
  user: any;
  newMessage: string;
  setNewMessage: (message: string) => void;
  isSending: boolean;
  onSendMessage: () => void;
  formatTime: (dateString: string) => string;
}

const MessageArea = ({
  selectedConversation,
  selectedUser,
  messages,
  messagesLoading,
  userProfiles,
  user,
  newMessage,
  setNewMessage,
  isSending,
  onSendMessage,
  formatTime
}: MessageAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    onSendMessage();
  };

  return (
    <Card className="h-full bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 flex flex-col">
      {selectedConversation && selectedUser ? (
        <>
          {/* Header de conversation - hauteur fixe */}
          <CardHeader className="flex-shrink-0 border-b border-slate-700/50 p-4 bg-slate-800/60">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-slate-600/50">
                {selectedUser.avatar_url ? (
                  <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.username} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                    {selectedUser.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold text-white text-lg">
                  {selectedUser.username}
                </h3>
                <p className="text-slate-400 text-sm">En ligne</p>
              </div>
            </div>
          </CardHeader>
          
          {/* Zone de messages avec scroll */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {messagesLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message) => {
                    const isMyMessage = message.sender_id === user?.id;
                    const senderProfile = userProfiles[message.sender_id];
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} relative`}
                      >
                        <div className={`max-w-xs lg:max-w-md relative ${isMyMessage ? 'mr-10' : 'ml-10'}`}>
                          <div
                            className={`px-4 py-3 rounded-2xl relative backdrop-blur-xl shadow-lg ${
                              isMyMessage
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md'
                                : 'bg-slate-700/70 border border-slate-600/50 text-white rounded-bl-md'
                            }`}
                          >
                            <p className={`text-xs font-semibold mb-2 ${
                              isMyMessage 
                                ? 'text-blue-100' 
                                : 'text-purple-300'
                            }`}>
                              {senderProfile?.username || 'Chargement...'}
                            </p>
                            <p className="text-sm break-words leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-2 ${
                              isMyMessage
                                ? 'text-white/70'
                                : 'text-slate-400'
                            }`}>
                              {formatTime(message.created_at)}
                            </p>
                          </div>
                          
                          <Avatar className={`h-8 w-8 absolute bottom-0 border-2 border-slate-600/50 ${
                            isMyMessage ? '-right-9' : '-left-9'
                          }`}>
                            {senderProfile?.avatar_url ? (
                              <AvatarImage src={senderProfile.avatar_url} alt={senderProfile.username} />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold">
                                {senderProfile?.username?.substring(0, 2).toUpperCase() || '??'}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Zone d'envoi fixe en bas */}
            <div className="flex-shrink-0 p-4 border-t border-slate-700/50 bg-slate-800/60 backdrop-blur-xl">
              <div className="flex gap-3">
                <Textarea
                  placeholder="Tapez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-grow resize-none bg-slate-700/50 border border-slate-600/50 backdrop-blur-xl text-white placeholder-slate-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 min-h-[48px] max-h-[48px] rounded-xl"
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white h-[48px] px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-blue-500/25"
                >
                  {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
              <MessageSquare className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Sélectionnez une conversation
            </h3>
            <p className="text-slate-400 max-w-sm">
              Choisissez une conversation dans la liste pour commencer à échanger avec vos amis
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MessageArea;
