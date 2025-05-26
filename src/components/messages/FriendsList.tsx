
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Users } from "lucide-react";

interface Friend {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
}

interface FriendsListProps {
  friends: Friend[];
  onStartConversation: (friendId: string) => void;
  onSwitchToAddFriend: () => void;
}

const FriendsList = ({ friends, onStartConversation, onSwitchToAddFriend }: FriendsListProps) => {
  return (
    <Card className="h-full flex flex-col bg-black/15 backdrop-blur-2xl border border-white/15 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-[1.02]">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="h-5 w-5" />
          Mes amis ({friends.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-6 overflow-hidden">
        {friends.length > 0 ? (
          <div className="h-full overflow-y-auto">
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
                    onClick={() => onStartConversation(friend.user_id)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">
              Vous n'avez pas encore d'amis
            </p>
            <Button 
              className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white" 
              onClick={onSwitchToAddFriend}
            >
              Ajouter des amis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendsList;
