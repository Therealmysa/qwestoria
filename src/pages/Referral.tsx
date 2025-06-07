
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReferrals } from "@/hooks/useReferrals";
import { useAuth } from "@/context/AuthContext";
import { Copy, Share2, Users, Trophy, Gift } from "lucide-react";
import { motion } from "framer-motion";

const Referral = () => {
  const { user } = useAuth();
  const { userReferrals, userProfile, isLoading, generateReferralCode, isGenerating, copyReferralLink } = useReferrals();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Vous devez être connecté pour accéder au système de parrainage.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedReferrals = userReferrals?.filter(ref => ref.status === 'completed') || [];
  const pendingReferrals = userReferrals?.filter(ref => ref.status === 'pending') || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Système de Parrainage
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Invitez vos amis à rejoindre Qwestoria et gagnez des BradCoins pour chaque parrainage réussi !
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{completedReferrals.length}</div>
              <p className="text-muted-foreground">Parrainages réussis</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{pendingReferrals.length}</div>
              <p className="text-muted-foreground">En attente</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{completedReferrals.length * 50}</div>
              <p className="text-muted-foreground">BradCoins gagnés</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Referral Code Section */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Votre Code de Parrainage
              </CardTitle>
              <CardDescription>
                Partagez ce code avec vos amis pour qu'ils puissent s'inscrire et vous faire gagner des BradCoins !
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProfile?.referral_code ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                    <code className="text-lg font-mono font-bold text-primary flex-1">
                      {userProfile.referral_code}
                    </code>
                    <Button
                      onClick={() => copyReferralLink(userProfile.referral_code)}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copier le lien
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lien de parrainage : {window.location.origin}/auth?ref={userProfile.referral_code}
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">Vous n'avez pas encore de code de parrainage.</p>
                  <Button
                    onClick={() => generateReferralCode()}
                    disabled={isGenerating}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isGenerating ? "Génération..." : "Générer mon code"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Referrals List */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Mes Parrainages</CardTitle>
              <CardDescription>
                Liste de tous vos parrainages et leur statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : userReferrals && userReferrals.length > 0 ? (
                <div className="space-y-4">
                  {userReferrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {referral.referred?.username || 'Utilisateur inconnu'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(referral.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={referral.status === 'completed' ? "default" : "secondary"}
                        >
                          {referral.status === 'completed' ? 'Complété' : 'En attente'}
                        </Badge>
                        {referral.status === 'completed' && (
                          <span className="text-sm text-primary font-medium">+50 BradCoins</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Aucun parrainage pour le moment. Commencez à inviter vos amis !
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Referral;
