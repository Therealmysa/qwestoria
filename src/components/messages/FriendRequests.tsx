
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, UserPlus } from "lucide-react";

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender_profile?: {
    username: string;
    avatar_url: string | null;
  };
  receiver_profile?: {
    username: string;
    avatar_url: string | null;
  };
}

const FriendRequests = () => {
  const { user } = useAuth();
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFriendRequests();
    }
  }, [user]);

  const fetchFriendRequests = async () => {
    try {
      setIsLoading(true);

      // Récupérer les demandes reçues
      const { data: incoming, error: incomingError } = await supabase
        .from("friendships")
        .select("*")
        .eq("receiver_id", user?.id)
        .eq("status", "pending");

      if (incomingError) throw incomingError;

      // Récupérer les demandes envoyées
      const { data: outgoing, error: outgoingError } = await supabase
        .from("friendships")
        .select("*")
        .eq("sender_id", user?.id)
        .eq("status", "pending");

      if (outgoingError) throw outgoingError;

      // Récupérer les profils des expéditeurs pour les demandes reçues
      if (incoming && incoming.length > 0) {
        const senderIds = incoming.map(req => req.sender_id);
        const { data: senderProfiles } = await supabase
          .from("profiles")
          .select("id, username, avatar_url")
          .in("id", senderIds);

        const incomingWithProfiles = incoming.map(req => ({
          ...req,
          sender_profile: senderProfiles?.find(profile => profile.id === req.sender_id)
        }));
        setIncomingRequests(incomingWithProfiles);
      } else {
        setIncomingRequests([]);
      }

      // Récupérer les profils des destinataires pour les demandes envoyées
      if (outgoing && outgoing.length > 0) {
        const receiverIds = outgoing.map(req => req.receiver_id);
        const { data: receiverProfiles } = await supabase
          .from("profiles")
          .select("id, username, avatar_url")
          .in("id", receiverIds);

        const outgoingWithProfiles = outgoing.map(req => ({
          ...req,
          receiver_profile: receiverProfiles?.find(profile => profile.id === req.receiver_id)
        }));
        setOutgoingRequests(outgoingWithProfiles);
      } else {
        setOutgoingRequests([]);
      }

    } catch (error) {
      console.error("Error fetching friend requests:", error);
      toast.error("Impossible de charger les demandes d'amis");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("friendships")
        .update({ status: "accepted" })
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Demande d'ami acceptée");
      fetchFriendRequests();
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Impossible d'accepter la demande");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("friendships")
        .update({ status: "rejected" })
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Demande d'ami refusée");
      fetchFriendRequests();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast.error("Impossible de refuser la demande");
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("id", requestId);

      if (error) throw error;

      toast.success("Demande annulée");
      fetchFriendRequests();
    } catch (error) {
      console.error("Error canceling friend request:", error);
      toast.error("Impossible d'annuler la demande");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Demandes reçues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Demandes reçues
            {incomingRequests.length > 0 && (
              <Badge variant="default" className="ml-2">
                {incomingRequests.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {incomingRequests.length > 0 ? (
            <div className="space-y-3">
              {incomingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {request.sender_profile?.avatar_url ? (
                        <AvatarImage src={request.sender_profile.avatar_url} />
                      ) : (
                        <AvatarFallback>
                          {request.sender_profile?.username?.substring(0, 2).toUpperCase() || "??"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {request.sender_profile?.username || "Utilisateur inconnu"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Veut être votre ami
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptRequest(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Aucune demande d'ami reçue
            </p>
          )}
        </CardContent>
      </Card>

      {/* Demandes envoyées */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes envoyées</CardTitle>
        </CardHeader>
        <CardContent>
          {outgoingRequests.length > 0 ? (
            <div className="space-y-3">
              {outgoingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {request.receiver_profile?.avatar_url ? (
                        <AvatarImage src={request.receiver_profile.avatar_url} />
                      ) : (
                        <AvatarFallback>
                          {request.receiver_profile?.username?.substring(0, 2).toUpperCase() || "??"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {request.receiver_profile?.username || "Utilisateur inconnu"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        En attente de réponse
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelRequest(request.id)}
                  >
                    Annuler
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Aucune demande envoyée
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendRequests;
