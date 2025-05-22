
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import useProfileCompletion from "@/hooks/useProfileCompletion";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Coins, Calendar, Tag, BadgeCheck, Package } from "lucide-react";

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

interface GroupedItems {
  [category: string]: ShopItem[];
}

const Shop = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { isChecking } = useProfileCompletion();
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [groupedItems, setGroupedItems] = useState<GroupedItems>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCoins, setUserCoins] = useState(0);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (user && !isChecking) {
      fetchShopItems();
      fetchUserCoins();
    }
  }, [user, loading, isChecking, navigate]);

  const fetchShopItems = async () => {
    try {
      const { data, error } = await supabase
        .from("shop_items")
        .select("*")
        .order("category");

      if (error) throw error;
      
      // Group items by category
      const items = data as ShopItem[];
      setShopItems(items);
      
      const grouped: GroupedItems = {};
      const cats = new Set<string>();
      
      items.forEach(item => {
        // Add category to set of categories
        cats.add(item.category);
        
        // Group items by category
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item);
      });
      
      setGroupedItems(grouped);
      setCategories(Array.from(cats));
      setActiveTab("all"); // Default to all items
      
    } catch (error) {
      console.error("Error fetching shop items:", error);
      toast.error("Impossible de charger les articles");
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

  const getFilteredItems = () => {
    if (activeTab === "all") {
      return shopItems;
    } else {
      return shopItems.filter(item => item.category === activeTab);
    }
  };

  if (isLoading || isChecking) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#9b87f5]">Boutique</h1>
          <p className="text-muted-foreground mt-1">
            Dépensez vos BradCoins pour obtenir des avantages exclusifs
          </p>
        </div>
        
        <div className="flex items-center bg-white dark:bg-[#221F26] px-4 py-2 rounded-lg border border-[#9b87f5]/30 shadow-sm">
          <Coins className="h-5 w-5 text-amber-400 mr-2" />
          <span className="font-bold">{userCoins} BradCoins</span>
        </div>
      </div>

      {/* Category filter tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="bg-secondary mb-4">
          <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#221F26]">
            Tous les articles
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#221F26]"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-2">
          {shopItems.length === 0 ? (
            <p className="text-center text-lg text-muted-foreground my-12">
              Aucun article disponible pour le moment.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {getFilteredItems().map((item) => (
                <Card 
                  key={item.id} 
                  className={`card-enhanced card-hover ${
                    !isItemAvailable(item) ? "opacity-60" : ""
                  }`}
                >
                  <CardHeader className="pb-2 relative">
                    <div className="flex flex-wrap gap-2 absolute top-4 right-4">
                      {item.is_vip_only && (
                        <Badge 
                          variant="outline" 
                          className="bg-amber-500/90 hover:bg-amber-500/90 text-black border-0"
                        >
                          VIP
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className="bg-[#9b87f5]/10 border-[#9b87f5]/30 text-[#9b87f5] dark:text-[#9b87f5]"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {item.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold text-[#9b87f5] truncate mt-2">
                      {item.name}
                    </CardTitle>
                    <CardDescription>
                      {item.available_until && (
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>Disponible jusqu'au {formatDate(item.available_until)}</span>
                        </div>
                      )}
                    </CardDescription>
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
                    ) : item.category.toLowerCase().includes('pack') ? (
                      <div className="w-full h-48 bg-purple-50 dark:bg-purple-900/20 rounded-md mb-3 flex items-center justify-center">
                        <Package className="h-16 w-16 text-[#9b87f5]" />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-50 dark:bg-gray-800/30 rounded-md mb-3 flex items-center justify-center">
                        <BadgeCheck className="h-16 w-16 text-[#9b87f5]/30" />
                      </div>
                    )}
                    <p className="text-sm text-foreground/80">{item.description}</p>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Coins className="h-5 w-5 text-amber-400 mr-1" />
                      <span className="font-bold text-amber-500 dark:text-amber-400">{item.price}</span>
                    </div>

                    {isItemAvailable(item) ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="default"
                            className="bg-[#9b87f5] hover:bg-[#8976e4]"
                            onClick={() => setSelectedItem(item)}
                            disabled={userCoins < item.price}
                          >
                            {userCoins < item.price ? "Solde insuffisant" : "Acheter"}
                          </Button>
                        </DialogTrigger>
                        {selectedItem && (
                          <DialogContent className="bg-background border-border">
                            <DialogHeader>
                              <DialogTitle>Confirmer l'achat</DialogTitle>
                              <DialogDescription>
                                Êtes-vous sûr de vouloir acheter cet article ?
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="py-4">
                              <h3 className="font-bold text-[#9b87f5]">{selectedItem.name}</h3>
                              <p className="text-sm text-foreground/80 mt-1">{selectedItem.description}</p>
                              
                              <div className="mt-4 p-3 bg-secondary rounded-md">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Prix:</span>
                                  <div className="flex items-center">
                                    <Coins className="h-4 w-4 text-amber-400 mr-1" />
                                    <span className="font-bold text-amber-500 dark:text-amber-400">{selectedItem.price}</span>
                                  </div>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between mt-2">
                                  <span className="text-muted-foreground">Votre solde:</span>
                                  <div className="flex items-center">
                                    <Coins className="h-4 w-4 text-amber-400 mr-1" />
                                    <span className="font-bold text-amber-500 dark:text-amber-400">{userCoins}</span>
                                  </div>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Solde après achat:</span>
                                  <div className="flex items-center">
                                    <Coins className="h-4 w-4 text-amber-400 mr-1" />
                                    <span className="font-bold text-amber-500 dark:text-amber-400">{userCoins - selectedItem.price}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <DialogFooter>
                              <Button 
                                variant="outline" 
                                onClick={() => setSelectedItem(null)}
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
                      <Button disabled variant="outline" className="cursor-not-allowed">
                        VIP seulement
                      </Button>
                    ) : item.available_until ? (
                      <Button disabled variant="outline" className="cursor-not-allowed">
                        Expiré
                      </Button>
                    ) : (
                      <Button disabled variant="outline" className="cursor-not-allowed">
                        Indisponible
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pack category display */}
      {groupedItems['Packs'] && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-[#9b87f5]" />
            <h2 className="text-2xl font-bold">Packs disponibles</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {groupedItems['Packs']?.map((pack) => (
              <Card key={pack.id} className="card-enhanced card-hover">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-[#9b87f5]">
                      {pack.name}
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className="bg-[#9b87f5]/90 hover:bg-[#9b87f5]/90 text-white border-0"
                    >
                      <Package className="h-3 w-3 mr-1" />
                      Pack
                    </Badge>
                  </div>
                  <CardDescription>{pack.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {pack.image_url ? (
                    <div className="w-full h-48 overflow-hidden rounded-md">
                      <img 
                        src={pack.image_url} 
                        alt={pack.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-md h-32 flex items-center justify-center">
                        <Package className="text-[#9b87f5] h-8 w-8" />
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-md h-32 flex items-center justify-center">
                        <BadgeCheck className="text-[#9b87f5] h-8 w-8" />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Coins className="h-5 w-5 text-amber-400 mr-1" />
                    <span className="font-bold text-amber-500 dark:text-amber-400">{pack.price}</span>
                  </div>
                  <Button 
                    className="bg-[#9b87f5] hover:bg-[#8976e4]"
                    onClick={() => setSelectedItem(pack)}
                    disabled={!isItemAvailable(pack) || userCoins < pack.price}
                  >
                    {!isItemAvailable(pack) 
                      ? "Indisponible" 
                      : userCoins < pack.price 
                        ? "Solde insuffisant" 
                        : "Acheter le pack"
                    }
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
