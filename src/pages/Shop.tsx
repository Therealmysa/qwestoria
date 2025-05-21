
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Coins, Calendar, BadgeCheck } from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  is_vip_only: boolean;
  available_until: string | null;
  category: string;
}

const Shop = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoins, setUserCoins] = useState(0);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchShopItems();
      fetchUserCoins();
    }
  }, [user, loading, navigate]);

  const fetchShopItems = async () => {
    try {
      const { data, error } = await supabase
        .from("shop_items")
        .select("*")
        .order("category");

      if (error) throw error;
      setShopItems(data as ShopItem[]);
    } catch (error) {
      console.error("Error fetching shop items:", error);
      toast.error("Failed to load shop items");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserCoins = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("brad_coins")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setUserCoins(data.balance);
    } catch (error) {
      console.error("Error fetching user coins:", error);
    }
  };

  const handlePurchase = async (item: ShopItem) => {
    if (!user) return;
    
    if (userCoins < item.price) {
      toast.error("Solde insuffisant pour cet achat");
      return;
    }

    try {
      setIsPurchasing(true);

      // Create purchase record
      const { error: purchaseError } = await supabase
        .from("user_purchases")
        .insert({
          user_id: user.id,
          item_id: item.id,
          price_paid: item.price
        });

      if (purchaseError) throw purchaseError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          amount: -item.price,
          type: "purchase",
          description: `Achat: ${item.name}`
        });

      if (transactionError) throw transactionError;

      // Update user balance (via trigger)
      
      // Refresh user coins
      await fetchUserCoins();
      
      toast.success("Achat réussi !");
      setSelectedItem(null);
    } catch (error: any) {
      console.error("Error processing purchase:", error);
      toast.error(error.message || "Échec de l'achat. Veuillez réessayer.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const isItemAvailable = (item: ShopItem) => {
    if (item.available_until) {
      const now = new Date();
      const endDate = new Date(item.available_until);
      if (endDate < now) return false;
    }
    
    if (item.is_vip_only && !profile?.is_vip) return false;
    
    return true;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#9b87f5]">Boutique</h1>
        <div className="flex items-center bg-[#221F26] px-4 py-2 rounded-lg border border-[#9b87f5]/30">
          <Coins className="h-5 w-5 text-amber-400 mr-2" />
          <span className="font-bold text-white">{userCoins} BradCoins</span>
        </div>
      </div>

      {shopItems.length === 0 ? (
        <p className="text-center text-lg text-gray-400 my-12">
          Aucun article disponible pour le moment.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shopItems.map((item) => (
            <Card 
              key={item.id} 
              className={`border-[#9b87f5]/50 bg-[#221F26] text-white ${
                !isItemAvailable(item) ? "opacity-60" : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="relative">
                  {item.is_vip_only && (
                    <span className="absolute top-0 right-0 bg-amber-500/80 text-black text-xs px-2 py-1 rounded-full">
                      VIP
                    </span>
                  )}
                  <CardTitle className="text-xl font-semibold text-[#9b87f5] truncate">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {item.category}
                    {item.available_until && (
                      <div className="flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>Disponible jusqu'au {formatDate(item.available_until)}</span>
                      </div>
                    )}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent>
                {item.image_url ? (
                  <div className="w-full h-48 overflow-hidden rounded-md mb-3">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-[#1A191C] rounded-md mb-3 flex items-center justify-center">
                    <BadgeCheck className="h-16 w-16 text-[#9b87f5]/30" />
                  </div>
                )}
                <p className="text-sm text-gray-300">{item.description}</p>
              </CardContent>
              
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center">
                  <Coins className="h-5 w-5 text-amber-400 mr-1" />
                  <span className="font-bold text-amber-400">{item.price}</span>
                </div>

                {isItemAvailable(item) ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-[#9b87f5] hover:bg-[#8976e4]"
                        onClick={() => setSelectedItem(item)}
                        disabled={userCoins < item.price}
                      >
                        {userCoins < item.price ? "Solde insuffisant" : "Acheter"}
                      </Button>
                    </DialogTrigger>
                    {selectedItem && (
                      <DialogContent className="bg-[#221F26] text-white border-gray-700">
                        <DialogHeader>
                          <DialogTitle>Confirmer l'achat</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Êtes-vous sûr de vouloir acheter cet article ?
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="py-4">
                          <h3 className="font-bold text-[#9b87f5]">{selectedItem.name}</h3>
                          <p className="text-sm text-gray-300 mt-1">{selectedItem.description}</p>
                          
                          <div className="mt-4 p-3 bg-[#1A191C] rounded-md">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Prix:</span>
                              <div className="flex items-center">
                                <Coins className="h-4 w-4 text-amber-400 mr-1" />
                                <span className="font-bold text-amber-400">{selectedItem.price}</span>
                              </div>
                            </div>
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-400">Votre solde:</span>
                              <div className="flex items-center">
                                <Coins className="h-4 w-4 text-amber-400 mr-1" />
                                <span className="font-bold text-amber-400">{userCoins}</span>
                              </div>
                            </div>
                            <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between">
                              <span className="text-gray-400">Solde après achat:</span>
                              <div className="flex items-center">
                                <Coins className="h-4 w-4 text-amber-400 mr-1" />
                                <span className="font-bold text-amber-400">{userCoins - selectedItem.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedItem(null)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            Annuler
                          </Button>
                          <Button 
                            className="bg-[#9b87f5] hover:bg-[#8976e4]"
                            onClick={() => handlePurchase(selectedItem)}
                            disabled={isPurchasing}
                          >
                            {isPurchasing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Traitement...
                              </>
                            ) : (
                              "Confirmer l'achat"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                ) : item.is_vip_only && !profile?.is_vip ? (
                  <Button disabled className="bg-gray-700 text-gray-400 cursor-not-allowed">
                    VIP seulement
                  </Button>
                ) : item.available_until ? (
                  <Button disabled className="bg-gray-700 text-gray-400 cursor-not-allowed">
                    Expiré
                  </Button>
                ) : (
                  <Button disabled className="bg-gray-700 text-gray-400 cursor-not-allowed">
                    Indisponible
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
