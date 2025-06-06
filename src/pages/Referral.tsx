
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Copy, 
  Share2, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Gift,
  MessageCircle,
  Send
} from "lucide-react";
import { useReferrals } from "@/hooks/useReferrals";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const Referral = () => {
  const { userReferralCode, referrals, stats, isLoadingCode, isLoadingReferrals } = useReferrals();
  const [shareMethod, setShareMethod] = useState<'link' | 'whatsapp' | 'discord' | null>(null);

  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/auth?ref=${userReferralCode}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papier !");
  };

  const shareOnWhatsApp = () => {
    const message = `🎮 Rejoins-moi sur Qwestoria ! 
    
Utilise mon code de parrainage : ${userReferralCode}
Ou clique directement ici : ${getReferralLink()}

Tu recevras 50 BradCoins gratuits à l'inscription ! 🪙`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnDiscord = () => {
    const message = `🎮 **Rejoins-moi sur Qwestoria !**

Utilise mon code de parrainage : \`${userReferralCode}\`
Ou clique directement ici : ${getReferralLink()}

Tu recevras **50 BradCoins gratuits** à l'inscription ! 🪙`;
    
    copyToClipboard(message);
    toast.success("Message Discord copié ! Colle-le dans ton serveur Discord.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Complété';
      case 'pending': return 'En attente';
      case 'expired': return 'Expiré';
      default: return status;
    }
  };

  if (isLoadingCode || isLoadingReferrals) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Système de Parrainage</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Invite tes amis sur Qwestoria et gagnez tous les deux des BradCoins ! 
          Tes filleuls reçoivent 50 BradCoins à l'inscription et tu gagnes 100 BradCoins 
          quand ils complètent leur première mission.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.total_referrals}</div>
            <div className="text-sm text-gray-600">Total parrainages</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.completed_referrals}</div>
            <div className="text-sm text-gray-600">Complétés</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.pending_referrals}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.total_rewards}</div>
            <div className="text-sm text-gray-600">BradCoins gagnés</div>
          </CardContent>
        </Card>
      </div>

      {/* Code de parrainage et partage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Ton Code de Parrainage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Code */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-lg">
              <span className="text-2xl font-mono font-bold text-blue-600">
                {userReferralCode}
              </span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyToClipboard(userReferralCode || '')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Lien de parrainage */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Lien de parrainage</label>
            <div className="flex gap-2">
              <Input 
                value={getReferralLink()} 
                readOnly 
                className="bg-gray-50"
              />
              <Button 
                variant="outline"
                onClick={() => copyToClipboard(getReferralLink())}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Boutons de partage */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              onClick={shareOnWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            
            <Button 
              onClick={shareOnDiscord}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Discord
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des parrainages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tes Filleuls ({referrals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun filleul pour le moment</h3>
              <p className="text-gray-600">Partage ton code de parrainage pour commencer à gagner des récompenses !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={referral.referred_profile?.avatar_url} />
                      <AvatarFallback>
                        {referral.referred_profile?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">
                        {referral.referred_profile?.username || 'Utilisateur'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Parrainé {formatDistanceToNow(new Date(referral.created_at), { locale: fr, addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={`${getStatusColor(referral.status)} flex items-center gap-1`}>
                      {getStatusIcon(referral.status)}
                      {getStatusText(referral.status)}
                    </Badge>
                    
                    {referral.reward_claimed && (
                      <div className="text-sm text-green-600 font-medium">
                        +100 BradCoins
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Referral;
