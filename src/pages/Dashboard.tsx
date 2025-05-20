
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Transactions from "@/components/Transactions";
import { Coins, CheckCircle2, XCircle, Clock3 } from "lucide-react";

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [coins, setCoins] = useState<number>(0);
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchUserData();
    }
  }, [user, loading, navigate]);

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
        return "bg-yellow-500/20 text-yellow-300";
      case "verified":
        return "bg-green-500/20 text-green-300";
      case "rejected":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-gray-500/20 text-gray-300";
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#9b87f5]">
        Tableau de bord
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* BradCoins Card */}
        <Card className="border-[#9b87f5]/50 bg-[#221F26] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-[#9b87f5]">
              Solde BradCoins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#9b87f5]/20">
                <Coins className="h-5 w-5 text-[#9b87f5]" />
              </span>
              <span className="text-2xl font-bold">
                {isLoading ? "..." : coins}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Card - using the new Transactions component */}
        <div className="lg:col-span-2">
          <Transactions />
        </div>
      </div>

      {/* Recent Submissions */}
      <h2 className="mb-4 mt-8 text-2xl font-bold text-white">
        Missions récentes
      </h2>
      <div className="rounded-lg border border-[#9b87f5]/50 bg-[#221F26]">
        {isLoading ? (
          <div className="p-6 text-center text-gray-400">Chargement...</div>
        ) : submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-700 text-left text-sm text-gray-400">
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
                    className="border-b border-gray-700 text-white hover:bg-[#1A1F2C]"
                  >
                    <td className="px-6 py-4">{submission.mission.title}</td>
                    <td className="px-6 py-4">
                      {submission.mission.reward_coins} BC
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(submission.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusBadgeClass(
                          submission.status
                        )}`}
                      >
                        {getStatusText(submission.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-400">
            Vous n'avez pas encore soumis de missions.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
