
import { useEffect, useState } from "react";
import {
  getFortniteShop,
  FortniteShopPayload,
  RawFortniteItem,
} from "@/services/fortniteApi";
import useProfileCompletion from "@/hooks/useProfileCompletion";
import { Loader2, Calendar, X, Tag, Search, FilterX, Star, Package, Timer, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchFilters } from "@/components/fortnite/SearchFilters";

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

const getRarityColor = (rarity: string) => {
  switch (rarity.toLowerCase()) {
    case 'common':
      return 'from-gray-400 to-gray-600';
    case 'uncommon':
      return 'from-green-400 to-green-600';
    case 'rare':
      return 'from-blue-400 to-blue-600';
    case 'epic':
      return 'from-purple-400 to-purple-600';
    case 'legendary':
      return 'from-orange-400 to-orange-600';
    case 'mythic':
      return 'from-yellow-400 to-yellow-600';
    default:
      return 'from-gray-400 to-gray-600';
  }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-6xl text-white mb-4 mx-auto" />
          <p className="text-white text-xl font-semibold">Chargement de la boutique...</p>
        </div>
      </div>
    );
  if (!payload)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center">
        <div className="bg-red-900/30 p-8 rounded-lg">
          <p className="text-xl font-bold text-white">Erreur de chargement de la boutique</p>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="text-white text-4xl" />
            <div>
              <h1 className="text-4xl font-bold text-white">Boutique Fortnite</h1>
              <p className="text-blue-100">
                Mise à jour: {formatDate(data.date)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Search and Filter Section with improved visibility */}
      <SearchFilters
        search={search}
        setSearch={setSearch}
        rarity={rarity}
        setRarity={setRarity}
        itemCount={getItemCount()}
        clearFilters={clearFilters}
      />

      {/* Stats */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto flex gap-6 justify-between">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-lg border border-blue-300/30">
            <div className="flex items-center gap-2">
              <Tag className="text-blue-300" />
              <span className="text-white font-semibold">
                {getItemCount()} objets disponibles
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-lg border border-orange-300/30">
            <div className="flex items-center gap-2">
              <Star className="text-orange-300" />
              <span className="text-white font-semibold">Boutique du jour</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Packs */}
      {filteredPacks.length > 0 && (
        <section className="p-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <Package className="text-purple-300" />
              Packs Vedettes
            </h2>
            <div className="grid gap-6">
              {filteredPacks.map((entry) => (
                <Card
                  key={entry.offerId}
                  onClick={() => setModalData({ entry })}
                  className="cursor-pointer bg-gray-900/50 border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex">
                    <div className="w-1/3">
                      <img
                        src={entry.brItems?.[0]?.images?.featured || entry.brItems?.[0]?.images?.icon}
                        alt={entry.brItems?.[0]?.name}
                        className="w-full h-48 object-cover rounded-l-lg"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <Badge className="bg-purple-600 mb-2">
                        Pack • {entry.brItems?.length} objets
                      </Badge>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {entry.brItems?.[0]?.name || "Pack Premium"}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Une collection d'objets exclusifs
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img src={data.vbuckIcon} alt="V-Bucks" className="h-6 w-6" />
                          <span className="text-2xl font-bold text-white">
                            {entry.finalPrice ?? entry.regularPrice}
                          </span>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold">
                          Voir détails
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Item Grid */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="text-blue-300" />
            Articles Individuels
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSingles.map((entry) => (
              <Card
                key={entry.offerId}
                onClick={() => setModalData({ entry })}
                className="cursor-pointer bg-gray-900/50 border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={entry.brItems![0].images.featured || entry.brItems![0].images.icon}
                      alt={entry.brItems![0].name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className={`absolute top-2 left-2 bg-gradient-to-r ${getRarityColor(entry.brItems![0].rarity.value)}`}>
                      {entry.brItems![0].rarity.displayValue}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-white text-lg mb-1">
                    {entry.brItems![0].name}
                  </CardTitle>
                  <p className="text-gray-400 text-sm">
                    {entry.brItems![0].type.displayValue}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-2">
                    <img src={data.vbuckIcon} alt="V-Bucks" className="h-5 w-5" />
                    <span className="text-white font-bold">
                      {entry.finalPrice ?? entry.regularPrice}
                    </span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm">
                    Détails
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* No results */}
      {filteredSingles.length === 0 && filteredPacks.length === 0 && (
        <div className="text-center p-12">
          <FilterX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Aucun résultat</h3>
          <p className="text-gray-300 mb-4">
            Aucun item ne correspond à votre recherche.
          </p>
          <button 
            onClick={clearFilters} 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full overflow-hidden">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white z-10"
            >
              <X size={24} />
            </button>
            
            {/* Pack Modal */}
            {modalData.entry.brItems && modalData.entry.brItems.length > 1 ? (
              <div className="p-6">
                <div className="mb-4">
                  <Badge className="bg-purple-600 mb-2">
                    Pack • {modalData.entry.brItems.length} objets
                  </Badge>
                  <h2 className="text-3xl font-bold text-white mb-2">Pack d'objets</h2>
                </div>
                
                <div className="flex gap-2 mb-6">
                  {modalData.entry.brItems.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => setModalData({...modalData, itemIndex: index})}
                      className={`w-16 h-16 rounded cursor-pointer border-2 ${modalData.itemIndex === index ? 'border-blue-500' : 'border-gray-600'}`}
                    >
                      <img 
                        src={item.images.icon} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-6">
                  <div className="w-1/2">
                    <img
                      src={
                        modalData.entry.brItems[modalData.itemIndex || 0].images.featured || 
                        modalData.entry.brItems[modalData.itemIndex || 0].images.icon
                      }
                      alt={modalData.entry.brItems[modalData.itemIndex || 0].name}
                      className="w-full h-64 object-cover rounded"
                    />
                  </div>
                  <div className="w-1/2">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {modalData.entry.brItems[modalData.itemIndex || 0].name}
                    </h2>
                    <Badge className={`bg-gradient-to-r ${getRarityColor(modalData.entry.brItems[modalData.itemIndex || 0].rarity.value)} mb-4`}>
                      {modalData.entry.brItems[modalData.itemIndex || 0].rarity.displayValue}
                    </Badge>
                    <p className="text-gray-300 mb-4">
                      {modalData.entry.brItems[modalData.itemIndex || 0].description || "Objet cosmétique exclusif"}
                    </p>
                    <div className="flex items-center gap-2 mb-6">
                      <img src={data.vbuckIcon} alt="V-Bucks" className="h-8 w-8" />
                      <span className="text-3xl font-bold text-white">
                        {modalData.entry.finalPrice ?? modalData.entry.regularPrice}
                      </span>
                    </div>
                    <div className="text-xs space-y-1 text-gray-400">
                      <div>OfferId: {modalData.entry.offerId}</div>
                      <div>Date in: {formatDate(modalData.entry.inDate)}</div>
                      <div>Date out: {formatDate(modalData.entry.outDate)}</div>
                      <div>Giftable: {modalData.entry.giftable ? "Oui" : "Non"}</div>
                      <div>Refundable: {modalData.entry.refundable ? "Oui" : "Non"}</div>
                    </div>
                    <a
                      href={`https://www.epicgames.com/fortnite/marketplace/item/${modalData.entry.brItems[modalData.itemIndex || 0].id}`}
                      target="_blank"
                      className="mt-4 block w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-white font-semibold text-center"
                    >
                      Voir sur Epic Games
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              // Single item modal
              <div className="flex">
                <div className="w-1/2">
                  <img
                    src={
                      modalData.entry.brItems![0].images.featured || modalData.entry.brItems![0].images.icon
                    }
                    alt={modalData.entry.brItems![0].name}
                    className="w-full h-80 object-cover"
                  />
                </div>
                <div className="w-1/2 p-6">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {modalData.entry.brItems![0].name}
                  </h2>
                  <Badge className={`bg-gradient-to-r ${getRarityColor(modalData.entry.brItems![0].rarity.value)} mb-4`}>
                    {modalData.entry.brItems![0].rarity.displayValue}
                  </Badge>
                  <p className="text-gray-300 mb-4">
                    {modalData.entry.brItems![0].description || "Objet cosmétique exclusif"}
                  </p>
                  <div className="flex items-center gap-2 mb-6">
                    <img src={data.vbuckIcon} alt="V-Bucks" className="h-8 w-8" />
                    <span className="text-3xl font-bold text-white">
                      {modalData.entry.finalPrice ?? modalData.entry.regularPrice}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 text-gray-400 mb-4">
                    <div>OfferId: {modalData.entry.offerId}</div>
                    <div>Date in: {formatDate(modalData.entry.inDate)}</div>
                    <div>Date out: {formatDate(modalData.entry.outDate)}</div>
                    <div>Giftable: {modalData.entry.giftable ? "Oui" : "Non"}</div>
                    <div>Refundable: {modalData.entry.refundable ? "Oui" : "Non"}</div>
                  </div>
                  <a
                    href={`https://www.epicgames.com/fortnite/marketplace/item/${modalData.entry.brItems![0].id}`}
                    target="_blank"
                    className="block w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-white font-semibold text-center"
                  >
                    Voir sur Epic Games
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
