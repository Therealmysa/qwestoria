
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
    <Card className="h-full bg-black/15 backdrop-blur-2xl border border-white/15 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02] flex flex-col">
      {selectedConversation && selectedUser ? (
        <>
          {/* Header de conversation - hauteur fixe */}
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
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {messagesLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-[#9b87f5]" />
                </div>
              ) : (
                <div className="space-y-4">
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
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Zone d'envoi fixe en bas */}
            <div className="flex-shrink-0 p-4 border-t border-white/15 bg-black/10 backdrop-blur-xl">
              <div className="flex gap-2">
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
                  className="flex-grow resize-none bg-black/20 border border-white/15 backdrop-blur-xl text-white placeholder-white/50 focus:border-purple-500/50 min-h-[40px] max-h-[40px]"
                  rows={1}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white h-[40px] px-4"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
  );
};

export default MessageArea;
