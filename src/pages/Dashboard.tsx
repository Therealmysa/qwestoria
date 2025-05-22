
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Transactions from "@/components/Transactions";
import { Coins, CheckCircle2, XCircle, Clock3, Trophy } from "lucide-react";
import { getRankByPoints } from "@/utils/rankUtils";
import RankBadge from "@/components/rank/RankBadge";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#9b87f5] dark:text-[#9b87f5] light:text-primary">
          Tableau de bord
        </h1>
        
        <div className="flex items-center gap-3">
          <RankBadge rankTier={currentRank} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Profile Summary Card */}
        <Card className="border-primary/20 dark:border-[#9b87f5]/50 bg-white dark:bg-[#221F26] shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-primary dark:text-[#9b87f5]">
              Profil Joueur
            </CardTitle>
          </CardHeader>
          <CardContent>
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
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Trophy className="h-5 w-5 text-primary/70 dark:text-[#9b87f5]/70 mr-2" />
                <span className="text-gray-700 dark:text-gray-200">Rang actuel:</span>
              </div>
              <RankBadge rankTier={currentRank} />
            </div>
          </CardContent>
        </Card>

        {/* BradCoins Card */}
        <Card className="border-primary/20 dark:border-[#9b87f5]/50 bg-white dark:bg-[#221F26] shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-primary dark:text-[#9b87f5]">
              Solde BradCoins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="mr-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 dark:bg-[#9b87f5]/20">
                <Coins className="h-6 w-6 text-primary dark:text-[#9b87f5]" />
              </span>
              <span className="text-3xl font-bold text-gray-800 dark:text-white">
                {isLoading ? "..." : coins}
              </span>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Progression vers le prochain rang</h4>
              <div className="flex items-center gap-2 mb-1">
                <RankBadge rankTier={currentRank} showText={false} size="sm" />
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary dark:bg-[#9b87f5] rounded-full" 
                      style={{ width: `${Math.min(100, (coins / (coins + 200)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                {currentRank !== 'unreal' && (
                  <RankBadge 
                    rankTier={Object.keys(rankTiers).indexOf(currentRank) < Object.keys(rankTiers).length - 1 
                      ? Object.keys(rankTiers)[Object.keys(rankTiers).indexOf(currentRank) + 1] as RankTier
                      : currentRank} 
                    showText={false}
                    size="sm"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Card - using the Transactions component */}
        <div className="lg:col-span-1">
          <Transactions />
        </div>
      </div>

      {/* Recent Submissions */}
      <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-800 dark:text-white">
        Missions récentes
      </h2>
      <Card className="border-primary/20 dark:border-[#9b87f5]/50 bg-white dark:bg-[#221F26] shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">Chargement...</div>
        ) : submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-left text-sm text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-3">Mission</th>
                  <th className="px-6 py-3">Récompense</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-[#1A1F2C]"
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
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Vous n'avez pas encore soumis de missions.
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
