
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Package, BadgeCheck } from "lucide-react";

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

interface PackDisplayProps {
  pack: ShopItem;
  userCoins: number;
  isAvailable: (item: ShopItem) => boolean;
  onSelectItem: (item: ShopItem) => void;
}

const PackDisplay: React.FC<PackDisplayProps> = ({ 
  pack, 
  userCoins, 
  isAvailable, 
  onSelectItem 
}) => {
  return (
    <Card key={pack.id} className="card-enhanced card-hover col-span-1 md:col-span-2 lg:col-span-4 border-slate-200 dark:border-slate-700">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 relative">
          {pack.image_url ? (
            <div className="w-full h-64 md:h-full overflow-hidden">
              <img 
                src={pack.image_url} 
                alt={pack.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-64 md:h-full bg-slate-100 dark:bg-slate-800/30 flex items-center justify-center">
              <Package className="h-20 w-20 text-slate-600 dark:text-slate-400" />
            </div>
          )}
          <Badge 
            variant="outline" 
            className="absolute top-4 left-4 bg-slate-600/90 hover:bg-slate-600/90 text-white border-0"
          >
            <Package className="h-3 w-3 mr-1" />
            Pack
          </Badge>
          {pack.is_vip_only && (
            <Badge 
              variant="outline" 
              className="absolute top-4 right-4 bg-amber-500/90 hover:bg-amber-500/90 text-black border-0"
            >
              VIP
            </Badge>
          )}
        </div>
        
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">{pack.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{pack.description}</p>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <Coins className="h-5 w-5 text-amber-400 mr-1" />
              <span className="font-bold text-amber-500 dark:text-amber-400 text-xl">{pack.price}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center gap-1">
              <BadgeCheck className="h-4 w-4" />
              <span>Contenu du pack</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {/* Here we would map through the items in the pack if we had that data
                  For now, we'll simulate 4 items in each pack */}
              {[1, 2, 3, 4].map((_, idx) => (
                <div 
                  key={idx} 
                  className="bg-secondary/30 rounded-md p-2 h-16 flex items-center justify-center"
                >
                  <BadgeCheck className="h-5 w-5 text-slate-600 dark:text-slate-400 opacity-70" />
                </div>
              ))}
            </div>
          </div>
          
          <CardFooter className="flex justify-end items-center p-0 pt-4 mt-auto">
            <Button 
              className="bg-slate-700 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500"
              onClick={() => onSelectItem(pack)}
              disabled={!isAvailable(pack) || userCoins < pack.price}
            >
              {!isAvailable(pack) 
                ? "Indisponible" 
                : userCoins < pack.price 
                  ? "Solde insuffisant" 
                  : "Acheter le pack"
              }
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default PackDisplay;
