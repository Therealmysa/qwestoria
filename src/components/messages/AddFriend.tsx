
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
}

const AddFriend = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .ilike("username", `%${searchQuery.trim()}%`)
        .neq("id", user?.id)
        .limit(10);

      if (error) throw error;

      setSearchResults(data || []);
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Erreur lors de la recherche");
    } finally {
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (receiverId: string) => {
    try {
      setIsLoading(true);

      // Vérifier si une demande existe déjà
      const { data: existingRequest, error: checkError } = await supabase
        .from("friendships")
        .select("*")
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user?.id})`)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          toast.error("Une demande d'ami est déjà en cours avec cet utilisateur");
        } else if (existingRequest.status === 'accepted') {
          toast.error("Vous êtes déjà amis avec cet utilisateur");
        } else {
          toast.error("Impossible d'envoyer une demande à cet utilisateur");
        }
        return;
      }

      // Créer la demande d'ami
      const { error } = await supabase
        .from("friendships")
        .insert([
          {
            sender_id: user?.id,
            receiver_id: receiverId,
            status: "pending"
          }
        ]);

      if (error) throw error;

      toast.success("Demande d'ami envoyée");
      
      // Retirer l'utilisateur des résultats de recherche
      setSearchResults(prev => prev.filter(user => user.id !== receiverId));
      
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Impossible d'envoyer la demande d'ami");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchUsers();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Ajouter un ami
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Rechercher un utilisateur par nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow"
          />
          <Button 
            onClick={searchUsers}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Résultats de recherche
            </h4>
            {searchResults.map((userProfile) => (
              <div
                key={userProfile.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {userProfile.avatar_url ? (
                      <AvatarImage src={userProfile.avatar_url} />
                    ) : (
                      <AvatarFallback>
                        {userProfile.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{userProfile.username}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => sendFriendRequest(userProfile.id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Ajouter
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        {searchQuery && searchResults.length === 0 && !isSearching && (
          <p className="text-muted-foreground text-center py-4">
            Aucun utilisateur trouvé pour "{searchQuery}"
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AddFriend;
