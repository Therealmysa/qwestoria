import { useEffect, useState } from "react";
import {
  getFortniteShop,
  FortniteShopPayload,
  RawFortniteItem,
} from "@/services/fortniteApi";
import useProfileCompletion from "@/hooks/useProfileCompletion";
import { Loader2, Calendar, X, Tag, Search, FilterX, Star, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return (
    `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()} ` +
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(
      2,
      "0"
    )}:${String(d.getSeconds()).padStart(2, "0")}`
  );
};

const FortniteShop = () => {
  const { isChecking } = useProfileCompletion();
  const [payload, setPayload] = useState<FortniteShopPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalData, setModalData] = useState<{
    entry: RawFortniteItem;
    itemIndex?: number;
  } | null>(null);
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("all");

  useEffect(() => {
    if (!isChecking) {
      getFortniteShop()
        .then((res) => setPayload(res))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isChecking]);

  const clearFilters = () => {
    setSearch("");
    setRarity("all");
  };

  if (isLoading || isChecking)
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="animate-spin text-5xl text-[#9b87f5]" />
      </div>
    );
  if (!payload)
    return (
      <div className="text-center p-8 text-red-500">
        Erreur de chargement...
      </div>
    );

  const { data } = payload;
  
  // Organize items: split between packs (entries with brItems length >1) and singles
  const packs = data.entries.filter((e) => (e.brItems?.length || 0) > 1);
  const singles = data.entries.filter((e) => (e.brItems?.length || 0) === 1);
  
  // Apply filters to singles
  const filteredSingles = singles.filter((e) =>
    e.brItems!.some((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) &&
      (rarity === "all" || i.rarity.value === rarity)
    )
  );

  // Apply filters to packs (a pack matches if any of its items match)
  const filteredPacks = packs.filter((e) =>
    e.brItems!.some((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) &&
      (rarity === "all" || i.rarity.value === rarity)
    )
  );

  // Count items for stats
  const getItemCount = () => {
    const singleItems = filteredSingles.reduce((count, entry) => count + entry.brItems!.length, 0);
    const packItems = filteredPacks.reduce((count, entry) => count + entry.brItems!.length, 0);
    return singleItems + packItems;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex flex-col md:flex-row items-center justify-between shadow-md rounded-lg mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <Calendar className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Boutique Fortnite</h1>
            <p className="text-sm text-gray-200">
              Mis à jour : {new Date(data.date).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Rechercher un item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 border-0 w-64"
            />
          </div>
          <Select
            value={rarity}
            onValueChange={(value) => setRarity(value)}
          >
            <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-sm text-white border-0 focus:ring-2 focus:ring-white/50">
              <SelectValue placeholder="Toutes raretés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes raretés</SelectItem>
              {["common", "uncommon", "rare", "epic", "legendary"].map((r) => (
                <SelectItem key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(search || rarity !== "all") && (
            <Button
              onClick={clearFilters}
              variant="ghost" 
              className="text-white hover:bg-white/10"
            >
              <FilterX className="mr-2 h-4 w-4" />
              Réinitialiser filtres
            </Button>
          )}
        </div>
      </header>

      {/* Stats bar */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="flex flex-wrap gap-6 justify-between items-center bg-white/5 dark:bg-black/20 backdrop-blur-sm p-4 rounded-lg border border-gray-200/10 shadow-sm">
          <div className="flex items-center gap-2">
            <Tag className="text-[#9b87f5]" />
            <span className="text-sm">
              {getItemCount()} objets affichés ({filteredSingles.length} articles individuels, {filteredPacks.length} packs)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="text-amber-400" />
            <span className="text-sm">Boutique du {new Date(data.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Packs (Displayed at the top, full width) */}
      {filteredPacks.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Package className="text-[#9b87f5]" />
            <h2 className="text-xl font-bold">Packs</h2>
          </div>
          <div className="grid gap-6">
            {filteredPacks.map((entry) => (
              <Card
                key={entry.offerId}
                onClick={() => setModalData({ entry })}
                className="cursor-pointer card-enhanced card-hover overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/3 h-64 md:h-auto">
                    {/* Use the featured image of the first item or a fallback */}
                    <img
                      src={entry.brItems?.[0]?.images?.featured || entry.brItems?.[0]?.images?.icon}
                      alt={entry.brItems?.[0]?.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-[#9b87f5] text-white">
                        PACK ({entry.brItems?.length} objets)
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Pack d'objets</h3>
                      {/* Preview of items in the pack */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                        {entry.brItems?.map((item, idx) => (
                          <div 
                            key={idx}
                            className="relative rounded-md overflow-hidden bg-secondary/30 group"
                          >
                            <img 
                              src={item.images.icon} 
                              alt={item.name} 
                              className="w-full h-20 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-xs text-white font-medium text-center px-1">
                                {item.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-2">
                        <img src={data.vbuckIcon} alt="V-Bucks" className="h-5 w-5" />
                        <span className="text-lg font-semibold">
                          {entry.finalPrice ?? entry.regularPrice}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        Voir détails
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Individual items */}
      <main className="max-w-7xl mx-auto p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredSingles.map((entry) => (
          <Card
            key={entry.offerId}
            onClick={() => setModalData({ entry })}
            className="cursor-pointer card-enhanced card-hover overflow-hidden"
          >
            <div className="relative">
              <img
                src={entry.brItems![0].images.featured || entry.brItems![0].images.icon}
                alt={entry.brItems![0].name}
                className="w-full h-56 object-cover"
              />
              <Badge className="absolute top-3 left-3 bg-white text-black text-sm">
                {entry.brItems![0].rarity.displayValue}
              </Badge>
            </div>
            <CardContent className="p-4">
              <CardTitle className="text-lg font-bold truncate mb-1">
                {entry.brItems![0].name}
              </CardTitle>
              <p className="text-sm text-muted-foreground truncate mb-2">
                {entry.brItems![0].type.displayValue}
              </p>
              <p className="text-xs text-foreground/80 line-clamp-3">
                {entry.brItems![0].description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 pt-0">
              <div className="flex items-center gap-2">
                <img src={data.vbuckIcon} alt="V-Bucks" className="h-5 w-5" />
                <span className="text-lg font-semibold">
                  {entry.finalPrice ?? entry.regularPrice}
                </span>
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Voir détails
              </span>
            </CardFooter>
          </Card>
        ))}
      </main>

      {filteredSingles.length === 0 && filteredPacks.length === 0 && (
        <div className="text-center p-12 bg-secondary/50 rounded-lg max-w-3xl mx-auto">
          <FilterX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Aucun résultat</h3>
          <p className="text-muted-foreground mb-6">
            Aucun item ne correspond à votre recherche. Essayez avec d'autres critères.
          </p>
          <Button onClick={clearFilters} className="bg-[#9b87f5] hover:bg-[#8976e4]">
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Modal - Enhanced to handle both single items and packs */}
      {modalData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10 bg-background/80 rounded-full p-1"
            >
              <X size={24} />
            </button>
            
            {/* Pack Modal View */}
            {modalData.entry.brItems && modalData.entry.brItems.length > 1 ? (
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Pack d'objets ({modalData.entry.brItems.length})</h2>
                
                {/* Item selector for packs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {modalData.entry.brItems.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => setModalData({...modalData, itemIndex: index})}
                      className={`relative w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${modalData.itemIndex === index ? 'border-primary' : 'border-transparent'}`}
                    >
                      <img 
                        src={item.images.icon} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="md:flex">
                  {/* Selected item display or first item if none selected */}
                  <div className="relative w-full md:w-1/2">
                    <img
                      src={
                        modalData.entry.brItems[modalData.itemIndex || 0].images.featured || 
                        modalData.entry.brItems[modalData.itemIndex || 0].images.icon
                      }
                      alt={modalData.entry.brItems[modalData.itemIndex || 0].name}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <Badge className="bg-white text-black mb-2">
                        {modalData.entry.brItems[modalData.itemIndex || 0].rarity.displayValue}
                      </Badge>
                      <h3 className="text-xl font-bold text-white">
                        {modalData.entry.brItems[modalData.itemIndex || 0].type.displayValue}
                      </h3>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">
                        {modalData.entry.brItems[modalData.itemIndex || 0].name}
                      </h2>
                      <p className="text-sm text-foreground/80 mb-4">
                        {modalData.entry.brItems[modalData.itemIndex || 0].description}
                      </p>
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={data.vbuckIcon}
                          alt="V-Bucks"
                          className="h-6 w-6"
                        />
                        <span className="text-2xl font-bold">
                          {modalData.entry.finalPrice ?? modalData.entry.regularPrice}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          (Pack complet)
                        </span>
                      </div>
                    </div>
                    <div className="text-xs space-y-1 bg-secondary/50 p-3 rounded-lg">
                      <div className="flex justify-between text-muted-foreground">
                        <span>OfferId:</span>
                        <span className="font-mono">{modalData.entry.offerId}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Date in:</span>
                        <span>{formatDate(modalData.entry.inDate)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Date out:</span>
                        <span>{formatDate(modalData.entry.outDate)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Giftable:</span>
                        <span>{modalData.entry.giftable ? "Oui" : "Non"}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Refundable:</span>
                        <span>{modalData.entry.refundable ? "Oui" : "Non"}</span>
                      </div>
                    </div>
                    <a
                      href={`https://www.epicgames.com/fortnite/marketplace/item/${modalData.entry.brItems[modalData.itemIndex || 0].id}`}
                      target="_blank"
                      className="mt-6 self-start bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-3 rounded-lg text-white font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
                    >
                      Voir sur le site
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              // Single item modal view (unchanged)
              <div className="md:flex">
                <div className="relative w-full md:w-1/2">
                  <img
                    src={
                      modalData.entry.brItems![0].images.featured || modalData.entry.brItems![0].images.icon
                    }
                    alt={modalData.entry.brItems![0].name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <Badge className="bg-white text-black mb-2">
                      {modalData.entry.brItems![0].rarity.displayValue}
                    </Badge>
                    <h3 className="text-xl font-bold text-white">
                      {modalData.entry.brItems![0].type.displayValue}
                    </h3>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {modalData.entry.brItems![0].name}
                    </h2>
                    <p className="text-sm text-foreground/80 mb-4">
                      {modalData.entry.brItems![0].description}
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={data.vbuckIcon}
                        alt="V-Bucks"
                        className="h-6 w-6"
                      />
                      <span className="text-2xl font-bold">
                        {modalData.entry.finalPrice ??
                          modalData.entry.regularPrice}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs space-y-1 bg-secondary/50 p-3 rounded-lg">
                    <div className="flex justify-between text-muted-foreground">
                      <span>OfferId:</span>
                      <span className="font-mono">{modalData.entry.offerId}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Date in:</span>
                      <span>{formatDate(modalData.entry.inDate)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Date out:</span>
                      <span>{formatDate(modalData.entry.outDate)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Giftable:</span>
                      <span>{modalData.entry.giftable ? "Oui" : "Non"}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Refundable:</span>
                      <span>{modalData.entry.refundable ? "Oui" : "Non"}</span>
                    </div>
                  </div>
                  <a
                    href={`https://www.epicgames.com/fortnite/marketplace/item/${modalData.entry.brItems![0].id}`}
                    target="_blank"
                    className="mt-6 self-start bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-3 rounded-lg text-white font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
                  >
                    Voir sur le site
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FortniteShop;
