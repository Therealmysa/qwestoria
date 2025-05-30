
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, RefreshCw, ShoppingCart } from "lucide-react";
import { useBradCoins } from "@/hooks/useBradCoins";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BradCoinsDisplay = () => {
  const { balance: bradCoinsBalance, refetch, isLoading, error } = useBradCoins();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Log à chaque changement
  useEffect(() => {
    console.log('🎨 BradCoinsDisplay: Component updated', {
      userId: user?.id,
      balance: bradCoinsBalance,
      isLoading,
      error: error?.message,
    });
  }, [bradCoinsBalance, isLoading, error, user?.id]);

  const handleRefresh = async () => {
    console.log('🔄 BradCoinsDisplay: Manual refresh triggered for user:', user?.id);
    try {
      const result = await refetch();
      console.log('✅ BradCoinsDisplay: Refresh result:', result.data);
    } catch (refreshError) {
      console.error('❌ BradCoinsDisplay: Refresh error:', refreshError);
    }
  };

  const handleBuyBradCoins = () => {
    // Navigate to the BradCoins tab in the shop
    navigate('/shop');
    // Trigger a custom event to switch to bradcoins tab
    setTimeout(() => {
      const event = new CustomEvent('switchToBradCoinsTab');
      window.dispatchEvent(event);
    }, 100);
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
        <div className="text-2xl font-bold flex items-center gap-1 text-gray-900 dark:text-white mb-4">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Chargement...
            </span>
          ) : error ? (
            <span className="text-red-500 text-sm">
              Erreur: {error.message}
            </span>
          ) : (
            <>
              {bradCoinsBalance.toLocaleString()}
              <Coins className="h-5 w-5 text-yellow-500" />
            </>
          )}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Utilisez vos BradCoins pour acheter des articles exclusifs dans la boutique.
        </p>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleBuyBradCoins}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Acheter des BradCoins
          </Button>
          
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
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p>User ID: {user.id.slice(0, 8)}...</p>
            <p>Balance affiché: {bradCoinsBalance}</p>
            <p>État: {isLoading ? 'Chargement' : error ? 'Erreur' : 'Chargé'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BradCoinsDisplay;
