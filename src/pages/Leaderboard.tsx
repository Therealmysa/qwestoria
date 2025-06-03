import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, User, Coins, CheckCircle as BadgeCheck } from "lucide-react";

interface LeaderboardUser {
  id: string;
  username: string;
  avatar_url: string | null;
  is_vip: boolean;
  total_coins: number;
  completed_missions: number;
  rank: number;
}

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"coins" | "missions">("coins");
  const [userRank, setUserRank] = useState<LeaderboardUser | null>(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, [filter]);

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    try {
      // Fixed to correctly call the get_leaderboard RPC function
      const { data, error } = await supabase.rpc("get_leaderboard", {
        sort_by: filter
      });

      if (error) throw error;
      
      // Add rank to each user
      const rankedData = data ? data.map((item: any, index: number) => ({
        ...item,
        rank: index + 1
      })) : [];
      
      setLeaderboardData(rankedData);
      
      // Find current user's rank
      if (user) {
        const currentUserRank = rankedData.find((item: LeaderboardUser) => item.id === user.id);
        setUserRank(currentUserRank || null);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Failed to load leaderboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return "text-amber-400";
      case 2: return "text-gray-400 dark:text-gray-300";
      case 3: return "text-amber-600";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="page-container container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#9b87f5] text-gradient-modern">Classement</h1>

      <div className="flex space-x-2 mb-6">
        <button
          className={`px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-[1.02] ${
            filter === "coins"
              ? "bg-gradient-to-r from-[#9b87f5] to-blue-600 text-white shadow-lg shadow-purple-500/30"
              : "dark:bg-black/20 dark:backdrop-blur-xl dark:border dark:border-white/15 bg-white/90 backdrop-blur-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 shadow-xl"
          }`}
          onClick={() => setFilter("coins")}
        >
          <Coins className="inline-block h-4 w-4 mr-1" /> Par BradCoins
        </button>
        <button
          className={`px-4 py-2 rounded-md transition-all duration-300 transform hover:scale-[1.02] ${
            filter === "missions"
              ? "bg-gradient-to-r from-[#9b87f5] to-blue-600 text-white shadow-lg shadow-purple-500/30"
              : "dark:bg-black/20 dark:backdrop-blur-xl dark:border dark:border-white/15 bg-white/90 backdrop-blur-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 shadow-xl"
          }`}
          onClick={() => setFilter("missions")}
        >
          <BadgeCheck className="inline-block h-4 w-4 mr-1" /> Par missions
        </button>
      </div>

      {/* User's rank card */}
      {userRank && (
        <Card className="mb-6 dark:bg-black/15 dark:backdrop-blur-xl dark:border dark:border-white/15 bg-white/90 backdrop-blur-md shadow-2xl dark:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-800 dark:text-white text-gradient-modern">Votre classement</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Votre position dans le classement global
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full bg-[#9b87f5]/20 dark:bg-[#9b87f5]/30 mr-4 ${getMedalColor(userRank.rank)}`}>
                <span className="font-bold">#{userRank.rank}</span>
              </div>
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={userRank.avatar_url || ""} />
                <AvatarFallback className="bg-gray-100 dark:bg-[#1A191C] text-gray-600 dark:text-gray-400">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                  <span>{userRank.username}</span>
                  {userRank.is_vip && (
                    <Badge className="bg-amber-500/80 text-black text-xs">VIP</Badge>
                  )}
                </div>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center mr-3">
                    <Coins className="h-3 w-3 mr-1 text-amber-500" /> {userRank.total_coins}
                  </span>
                  <span className="flex items-center">
                    <BadgeCheck className="h-3 w-3 mr-1 text-green-500" /> {userRank.completed_missions} missions
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="dark:bg-black/15 dark:backdrop-blur-xl dark:border dark:border-white/15 bg-white/90 backdrop-blur-md shadow-2xl dark:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-gray-800 dark:text-white text-gradient-modern">Top Joueurs</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {filter === "coins" ? "Classement par nombre de BradCoins" : "Classement par missions complétées"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
            </div>
          ) : leaderboardData.length === 0 ? (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">Aucune données disponible</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-white/15">
                  <TableHead className="text-gray-600 dark:text-gray-400">Rang</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Joueur</TableHead>
                  {filter === "coins" ? (
                    <TableHead className="text-right text-gray-600 dark:text-gray-400">BradCoins</TableHead>
                  ) : (
                    <TableHead className="text-right text-gray-600 dark:text-gray-400">Missions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((userData) => (
                  <TableRow 
                    key={userData.id} 
                    className={`border-b border-gray-200 dark:border-white/15 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
                      user && user.id === userData.id ? "bg-[#9b87f5]/10 dark:bg-[#9b87f5]/10" : ""
                    }`}
                  >
                    <TableCell className="font-medium">
                      <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                        userData.rank <= 3 ? `bg-[#9b87f5]/20 ${getMedalColor(userData.rank)}` : "text-gray-500"
                      }`}>
                        {userData.rank <= 3 ? (
                          <Trophy className={`h-4 w-4 ${getMedalColor(userData.rank)}`} />
                        ) : (
                          <span>#{userData.rank}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={userData.avatar_url || ""} />
                          <AvatarFallback className="bg-gray-100 dark:bg-[#1A191C] text-gray-600 dark:text-gray-400">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                          <span>{userData.username}</span>
                          {userData.is_vip && (
                            <Badge className="bg-amber-500/80 text-black text-xs">VIP</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    {filter === "coins" ? (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <Coins className="h-4 w-4 mr-1 text-amber-500" />
                          <span className="font-medium text-gray-800 dark:text-white">{userData.total_coins}</span>
                        </div>
                      </TableCell>
                    ) : (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <BadgeCheck className="h-4 w-4 mr-1 text-green-500" />
                          <span className="font-medium text-gray-800 dark:text-white">{userData.completed_missions}</span>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
