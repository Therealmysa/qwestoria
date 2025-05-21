
import { useEffect, useState } from "react";
import { getFortniteShop, FortniteShopItem } from "@/services/fortniteApi";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar } from "lucide-react";

const FortniteShop = () => {
  const [shopItems, setShopItems] = useState<FortniteShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchFortniteShop();
  }, []);

  const fetchFortniteShop = async () => {
    try {
      setIsLoading(true);
      const data = await getFortniteShop();
      setShopItems(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching Fortnite shop:", error);
      toast.error("Failed to load Fortnite shop items");
    } finally {
      setIsLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary": return "bg-amber-500/80 text-black";
      case "epic": return "bg-purple-500/80 text-white";
      case "rare": return "bg-blue-500/80 text-white";
      case "uncommon": return "bg-green-500/80 text-white";
      case "common": return "bg-gray-500/80 text-white";
      default: return "bg-gray-500/80 text-white";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#9b87f5]">Boutique Fortnite du Jour</h1>
        
        {lastUpdated && (
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              Mis à jour le {lastUpdated.toLocaleDateString()} à {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#9b87f5] mx-auto mb-4" />
            <p className="text-gray-400">Chargement de la boutique Fortnite...</p>
          </div>
        </div>
      ) : shopItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400 mb-4">
            La boutique Fortnite n'est pas disponible pour le moment.
          </p>
          <button
            onClick={fetchFortniteShop}
            className="px-4 py-2 bg-[#9b87f5] text-white rounded-md hover:bg-[#8976e4]"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shopItems.map((item) => (
            <Card 
              key={item.id} 
              className="border-[#9b87f5]/50 bg-[#221F26] text-white overflow-hidden"
            >
              <div className="w-full h-56 relative overflow-hidden">
                <img 
                  src={item.images.featured || item.images.icon} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-2 right-2 ${getRarityColor(item.rarity)}`}>
                  {item.rarity}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-[#9b87f5]">
                  {item.name}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {item.type}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-300">{item.description}</p>
              </CardContent>
              
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center">
                  <img 
                    src={item.priceIconLink} 
                    alt="V-Bucks" 
                    className="h-5 w-5 mr-1"
                  />
                  <span className="font-bold text-white">{item.price}</span>
                </div>
                
                <a 
                  href="https://www.epicgames.com/fortnite/en-US/home" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#9b87f5] hover:bg-[#8976e4] text-white px-3 py-1 rounded text-sm"
                >
                  Voir dans Fortnite
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FortniteShop;
