
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, RefreshCw } from "lucide-react";
import { useBradCoins } from "@/hooks/useBradCoins";
import { useAuth } from "@/context/AuthContext";

const BradCoinsDisplay = () => {
  const { balance: bradCoinsBalance, refetch, isLoading } = useBradCoins();
  const { user } = useAuth();

  const handleRefresh = async () => {
    console.log('Manual refresh triggered for user:', user?.id);
    await refetch();
  };

  return (
    <Card className="dark:bg-purple-800/20 dark:backdrop-blur-xl dark:border dark:border-purple-500/20 bg-white/90 backdrop-blur-md shadow-xl dark:shadow-purple-500/20 transform hover:scale-[1.02] transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-500">
          <Coins className="h-5 w-5 text-yellow-500" />
          BradCoins
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Votre solde actuel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex items-center gap-1 text-gray-900 dark:text-white">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Chargement...
            </span>
          ) : (
            <>
              {bradCoinsBalance.toLocaleString()}
              <Coins className="h-5 w-5 text-yellow-500" />
            </>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Utilisez vos BradCoins pour acheter des articles exclusifs dans la boutique.
        </p>
        <div className="flex gap-2 mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="dark:bg-purple-700/30 dark:hover:bg-purple-700/50 bg-purple-100/70 hover:bg-purple-200/90 backdrop-blur-sm border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
        {user && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            User ID: {user.id.slice(0, 8)}...
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BradCoinsDisplay;
