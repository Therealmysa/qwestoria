
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Transactions from "@/components/Transactions";
import { Coins, CheckCircle2, XCircle, Clock3, Trophy, BadgeCheck, ShoppingBag } from "lucide-react";
import { getRankByPoints } from "@/utils/rankUtils";
import RankBadge from "@/components/rank/RankBadge";
import useProfileCompletion from "@/hooks/useProfileCompletion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface BradCoin {
  balance: number;
}

interface MissionSubmission {
  id: string;
  mission: {
    title: string;
    reward_coins: number;
  };
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [coins, setCoins] = useState<number>(0);
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isProfileComplete, missingFields } = useProfileCompletion();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (user) {
      // Check if profile is complete
      if (!isProfileComplete && !loading) {
        navigate("/profile?complete=1");
      } else {
        fetchUserData();
      }
    }
  }, [user, loading, navigate, isProfileComplete]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch user's BradCoins
      const { data: coinsData, error: coinsError } = await supabase
        .from("brad_coins")
        .select("balance")
        .eq("user_id", user?.id)
        .single();

      if (coinsError) throw coinsError;
      setCoins((coinsData as BradCoin).balance);

      // Fetch user's mission submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from("mission_submissions")
        .select(
          `
          id,
          mission:mission_id (
            title,
            reward_coins
          ),
          status,
          created_at
        `
        )
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (submissionsError) throw submissionsError;
      setSubmissions(submissionsData as MissionSubmission[]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock3 className="h-4 w-4 text-yellow-300" />;
      case "verified":
        return <CheckCircle2 className="h-4 w-4 text-green-300" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-300" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-300";
      case "verified":
        return "bg-green-500/20 text-green-600 dark:text-green-300";
      case "rejected":
        return "bg-red-500/20 text-red-600 dark:text-red-300";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "verified":
        return "Validée";
      case "rejected":
        return "Refusée";
      default:
        return status;
    }
  };

  const currentRank = getRankByPoints(coins);
  
  // Calculate next rank progress percentage
  const calculateNextRankProgress = () => {
    // This is a simplified calculation - you should replace with actual tier logic
    return Math.min(100, (coins / (coins + 200)) * 100);
  };

  // Get the next rank tier name
  const getNextRankName = () => {
    // Simplified - replace with actual next rank logic
    return currentRank;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary dark:text-[#9b87f5]">
          Tableau de bord
        </h1>
        
        <div className="flex items-center gap-3">
          <RankBadge rankTier={currentRank} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Profile Summary Card - Improved with better light mode styling */}
        <Card className="border-primary/20 dark:border-[#9b87f5]/50 bg-white dark:bg-[#221F26] shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-xl font-semibold text-primary dark:text-[#9b87f5]">
              Profil Joueur
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20 dark:border-[#9b87f5]/50">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile?.username || "Utilisateur"} />
                ) : (
                  <AvatarFallback className="bg-primary/10 dark:bg-[#9b87f5]/20 text-primary dark:text-[#9b87f5] text-lg font-semibold">
                    {profile?.username ? profile.username.substring(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg text-primary dark:text-[#9b87f5]">
                  {profile?.username || user?.email?.split("@")[0] || "Utilisateur"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Membre depuis {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("fr-FR") : "récemment"}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-primary dark:text-[#9b87f5] mr-2" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">Rang actuel:</span>
                </div>
                <RankBadge rankTier={currentRank} />
              </div>
              
              {/* Add clickable mission button */}
              <button 
                onClick={() => navigate("/missions")} 
                className="mt-4 w-full py-2 px-4 rounded-md bg-primary/10 hover:bg-primary/20 
                          dark:bg-[#9b87f5]/10 dark:hover:bg-[#9b87f5]/20 
                          text-primary dark:text-[#9b87f5] 
                          transition-colors font-medium flex items-center justify-center gap-2"
              >
                <BadgeCheck className="h-4 w-4" />
                Voir les missions disponibles
              </button>
            </div>
          </CardContent>
        </Card>

        {/* BradCoins Card - Improved with better light mode styling */}
        <Card className="border-primary/20 dark:border-[#9b87f5]/50 bg-white dark:bg-[#221F26] shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-xl font-semibold text-primary dark:text-[#9b87f5]">
              Solde BradCoins
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center mb-4">
              <span className="mr-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 dark:bg-[#9b87f5]/20">
                <Coins className="h-7 w-7 text-primary dark:text-[#9b87f5]" />
              </span>
              <div>
                <span className="text-3xl font-bold text-gray-800 dark:text-white">
                  {isLoading ? "..." : coins}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">BradCoins</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Progression vers le prochain rang
              </h4>
              <div className="flex items-center gap-2 mb-1">
                <RankBadge rankTier={currentRank} showText={false} size="sm" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/80 dark:from-[#9b87f5] dark:to-[#7654d3] rounded-full" 
                      style={{ width: `${calculateNextRankProgress()}%` }}
                    ></div>
                  </div>
                </div>
                {currentRank !== 'unreal' && (
                  <RankBadge 
                    rankTier={getNextRankName()}
                    showText={false}
                    size="sm"
                  />
                )}
              </div>
              
              {/* Add shop button */}
              <button 
                onClick={() => navigate("/shop")} 
                className="mt-4 w-full py-2 px-4 rounded-md bg-primary/10 hover:bg-primary/20 
                          dark:bg-[#9b87f5]/10 dark:hover:bg-[#9b87f5]/20 
                          text-primary dark:text-[#9b87f5] 
                          transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Visiter la boutique
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Card - using the Transactions component */}
        <div className="lg:col-span-1">
          <Transactions />
        </div>
      </div>

      {/* Recent Submissions - Improved with better light mode styling */}
      <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <BadgeCheck className="h-5 w-5 text-primary dark:text-[#9b87f5]" />
        Missions récentes
      </h2>
      <Card className="border-primary/20 dark:border-[#9b87f5]/50 bg-white dark:bg-[#221F26] shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400 animate-pulse">
            <div className="mx-auto h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
            Chargement...
          </div>
        ) : submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-left text-sm text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-3 font-medium">Mission</th>
                  <th className="px-6 py-3 font-medium">Récompense</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="border-b border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-[#1A1F2C]"
                  >
                    <td className="px-6 py-4">{submission.mission.title}</td>
                    <td className="px-6 py-4 flex items-center gap-1">
                      <span>{submission.mission.reward_coins}</span>
                      <Coins className="h-4 w-4 text-primary dark:text-[#9b87f5]" />
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(submission.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${getStatusBadgeClass(
                          submission.status
                        )}`}
                      >
                        {getStatusIcon(submission.status)}
                        {getStatusText(submission.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 dark:bg-[#9b87f5]/20 p-3">
                <BadgeCheck className="h-6 w-6 text-primary dark:text-[#9b87f5]" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pas encore de missions
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Vous n'avez pas encore soumis de missions.
            </p>
            <button 
              onClick={() => navigate("/missions")} 
              className="px-4 py-2 bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#8976e4] text-white rounded-md transition-colors"
            >
              Découvrir les missions
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
