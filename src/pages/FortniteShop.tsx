import { useEffect, useState } from "react";
import {
  getFortniteShop,
  FortniteShopPayload,
  RawFortniteItem,
} from "@/services/fortniteApi";
import useProfileCompletion from "@/hooks/useProfileCompletion";
import { Loader2, Calendar, X, Tag, Search, FilterX, Star, Package, Timer, Zap, AlertCircle } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);
  const [modalData, setModalData] = useState<{
    entry: RawFortniteItem;
    itemIndex?: number;
  } | null>(null);
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("all");

  useEffect(() => {
    if (!isChecking) {
      console.log('Starting to fetch Fortnite shop data...');
      setIsLoading(true);
      setError(null);
      
      getFortniteShop()
        .then((res) => {
          console.log('Successfully received shop data:', res);
          setPayload(res);
          setError(null);
        })
        .catch((err) => {
          console.error('Failed to fetch shop data:', err);
          setError(err.message || 'Erreur lors du chargement de la boutique');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isChecking]);

  const clearFilters = () => {
    setSearch("");
    setRarity("all");
  };

  if (isLoading || isChecking) {
    return (
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <Loader2 className="animate-spin text-6xl text-white mb-4 mx-auto" />
          <p className="text-white text-xl font-semibold">Chargement de la boutique...</p>
          <p className="text-blue-200 text-sm mt-2">Récupération des données Fortnite</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="bg-red-900/30 backdrop-blur-md p-8 rounded-2xl border border-red-500/30 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Erreur de chargement</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (!payload || !payload.data || !payload.data.entries) {
    return (
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="bg-yellow-900/30 backdrop-blur-md p-8 rounded-2xl border border-yellow-500/30 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Aucune donnée disponible</h2>
          <p className="text-yellow-200 mb-6">La boutique Fortnite semble être vide pour le moment.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Actualiser
          </Button>
        </div>
      </div>
    );
  }

  const { data } = payload;
  
  // Organize items: split between packs (entries with brItems length >1) and singles
  const packs = data.entries.filter((e) => (e.brItems?.length || 0) > 1);
  const singles = data.entries.filter((e) => (e.brItems?.length || 0) <= 1);
  
  // Apply filters to singles
  const filteredSingles = singles.filter((e) => {
    if (!e.brItems || e.brItems.length === 0) return false;
    return e.brItems.some((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) &&
      (rarity === "all" || i.rarity.value === rarity)
    );
  });

  // Apply filters to packs (a pack matches if any of its items match)
  const filteredPacks = packs.filter((e) => {
    if (!e.brItems || e.brItems.length === 0) return false;
    return e.brItems.some((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) &&
      (rarity === "all" || i.rarity.value === rarity)
    );
  });

  // Count items for stats
  const getItemCount = () => {
    const singleItems = filteredSingles.reduce((count, entry) => count + (entry.brItems?.length || 0), 0);
    const packItems = filteredPacks.reduce((count, entry) => count + (entry.brItems?.length || 0), 0);
    return singleItems + packItems;
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 p-8">
      {/* Container détaché avec arrière-plan animé inclus */}
      <div className="max-w-7xl mx-auto bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 animate-pulse" 
               style={{
                 backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
                 backgroundSize: '60px 60px'
               }}
          />
        </div>

        {/* Main Container content */}
        <div className="relative z-10">
          
          {/* Header */}
          <header className="bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-orange-500/90 backdrop-blur-md border-b border-white/20">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/30">
                      <Calendar className="text-white h-8 w-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-1">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">
                      BOUTIQUE FORTNITE
                    </h1>
                    <p className="text-blue-100 font-medium flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      Mis à jour : {new Date(data.date).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 dark:text-gray-300 h-5 w-5 z-10" />
                    <Input
                      type="text"
                      placeholder="Rechercher un item..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-12 pr-4 py-3 rounded-2xl bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-600 border-2 border-gray-300/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-400/30 w-80 shadow-lg"
                    />
                  </div>
                  <Select value={rarity} onValueChange={(value) => setRarity(value)}>
                    <SelectTrigger className="w-[200px] bg-white/95 backdrop-blur-sm text-gray-900 border-2 border-gray-300/80 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-500 rounded-2xl shadow-lg font-medium">
                      <SelectValue placeholder="Toutes raretés" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300 shadow-xl">
                      <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">Toutes raretés</SelectItem>
                      {["common", "uncommon", "rare", "epic", "legendary"].map((r) => (
                        <SelectItem key={r} value={r} className="text-gray-900 hover:bg-gray-100">
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(search || rarity !== "all") && (
                    <Button
                      onClick={clearFilters}
                      className="bg-white/95 hover:bg-white text-gray-900 hover:text-gray-700 backdrop-blur-sm border-2 border-gray-300/80 rounded-2xl shadow-lg font-medium px-6"
                    >
                      <FilterX className="mr-2 h-4 w-4" />
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Stats bar */}
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-6 justify-between items-center bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                  <Tag className="text-white h-5 w-5" />
                </div>
                <div>
                  <p className="text-white font-bold">
                    {getItemCount()} objets disponibles
                  </p>
                  <p className="text-blue-200 text-sm">
                    {filteredSingles.length} articles • {filteredPacks.length} packs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                  <Star className="text-white h-5 w-5" />
                </div>
                <div>
                  <p className="text-white font-bold">Boutique du jour</p>
                  <p className="text-orange-200 text-sm">
                    {new Date(data.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Packs Section */}
          {filteredPacks.length > 0 && (
            <section className="px-6 mb-12">
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                  <Package className="text-white h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">PACKS PREMIUM</h2>
                  <p className="text-purple-200">Collections exclusives et offres groupées</p>
                </div>
              </div>
              
              <div className="grid gap-8">
                {filteredPacks.map((entry) => (
                  <Card
                    key={entry.offerId}
                    onClick={() => setModalData({ entry })}
                    className="cursor-pointer bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden group"
                  >
                    <div className="flex flex-col lg:flex-row">
                      <div className="relative lg:w-2/5 h-80 lg:h-auto">
                        <img
                          src={entry.brItems?.[0]?.images?.featured || entry.brItems?.[0]?.images?.icon}
                          alt={entry.brItems?.[0]?.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-sm font-bold px-3 py-1">
                            <Package className="h-4 w-4 mr-1" />
                            PACK • {entry.brItems?.length} OBJETS
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-2xl font-black text-white mb-2">
                            {entry.brItems?.[0]?.name || "Pack Premium"}
                          </h3>
                          <div className="flex items-center gap-2 text-white/80">
                            <Timer className="h-4 w-4" />
                            <span className="text-sm">Disponible maintenant</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-8">
                        <div className="mb-6">
                          <h4 className="text-xl font-bold text-white mb-3">Contenu du pack</h4>
                          <p className="text-gray-300 mb-4">
                            Une collection soigneusement sélectionnée de {entry.brItems?.length} objets exclusifs pour personnaliser votre expérience Fortnite.
                          </p>
                        </div>
                        
                        {/* Items grid preview */}
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                          {entry.brItems?.map((item, idx) => (
                            <div 
                              key={idx}
                              className="relative group/item"
                            >
                              <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${getRarityColor(item.rarity.value)} p-1`}>
                                <div className="bg-gray-900 rounded-lg overflow-hidden">
                                  <img 
                                    src={item.images.icon} 
                                    alt={item.name} 
                                    className="w-full h-16 object-cover group-hover/item:scale-110 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 transition-colors duration-300" />
                                </div>
                              </div>
                              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 bg-black/90 px-2 py-1 rounded text-xs text-white whitespace-nowrap z-10">
                                {item.name}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-white/20">
                          <div className="flex items-center gap-3">
                            <img src={data.vbuckIcon} alt="V-Bucks" className="h-8 w-8" />
                            <span className="text-3xl font-black text-white">
                              {entry.finalPrice ?? entry.regularPrice}
                            </span>
                            <span className="text-yellow-400 text-sm font-medium">V-Bucks</span>
                          </div>
                          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-6 py-3 rounded-xl">
                            VOIR LES DÉTAILS
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Individual Items Grid */}
          <main className="px-6 pb-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
                <Star className="text-white h-6 w-6" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">ARTICLES INDIVIDUELS</h2>
                <p className="text-blue-200">Objets cosmétiques et accessoires</p>
              </div>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSingles.map((entry) => {
                const item = entry.brItems?.[0];
                if (!item) return null;
                
                return (
                  <Card
                    key={entry.offerId}
                    onClick={() => setModalData({ entry })}
                    className="cursor-pointer bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden group"
                  >
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(item.rarity.value)} opacity-20`} />
                      <img
                        src={item.images.featured || item.images.icon}
                        alt={item.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          console.error('Image failed to load:', item.images);
                          e.currentTarget.src = item.images.icon;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <Badge className={`absolute top-4 left-4 bg-gradient-to-r ${getRarityColor(item.rarity.value)} text-white border-0 font-bold`}>
                        {item.rarity.displayValue}
                      </Badge>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-1 truncate">
                          {item.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-2">
                          {item.type.displayValue}
                        </p>
                      </div>
                    </div>
                    
                    <CardFooter className="flex justify-between items-center p-4 bg-black/30 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <img src={data.vbuckIcon} alt="V-Bucks" className="h-6 w-6" />
                        <span className="text-xl font-bold text-white">
                          {entry.finalPrice ?? entry.regularPrice}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-lg"
                      >
                        DÉTAILS
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </main>

          {/* No results message */}
          {filteredSingles.length === 0 && filteredPacks.length === 0 && (
            <div className="text-center p-12">
              <div className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-12 border border-white/10">
                <FilterX className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Aucun résultat trouvé</h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Aucun item ne correspond à votre recherche. Essayez avec d'autres critères.
                </p>
                <Button 
                  onClick={clearFilters} 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-8 py-3 rounded-xl"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl max-w-6xl w-full overflow-hidden shadow-2xl border border-white/20 relative">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white z-20 bg-black/50 backdrop-blur-sm rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
            
            {/* Pack Modal View */}
            {modalData.entry.brItems && modalData.entry.brItems.length > 1 ? (
              <div className="p-8">
                <div className="mb-8">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-4">
                    <Package className="h-4 w-4 mr-2" />
                    PACK PREMIUM • {modalData.entry.brItems.length} OBJETS
                  </Badge>
                  <h2 className="text-4xl font-black text-white mb-2">Pack d'objets exclusif</h2>
                  <p className="text-gray-300 text-lg">Collection soigneusement sélectionnée d'objets cosmétiques</p>
                </div>
                
                {/* Item selector for packs */}
                <div className="flex flex-wrap gap-3 mb-8 p-4 bg-black/30 rounded-2xl">
                  {modalData.entry.brItems.map((item, index) => (
                    <div 
                      key={index}
                      onClick={() => setModalData({...modalData, itemIndex: index})}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${modalData.itemIndex === index ? 'border-purple-400 scale-110' : 'border-white/20 hover:border-white/40'}`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(item.rarity.value)} opacity-30`} />
                      <img 
                        src={item.images.icon} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="lg:flex gap-8">
                  {/* Selected item display */}
                  <div className="relative lg:w-1/2 mb-6 lg:mb-0">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(modalData.entry.brItems[modalData.itemIndex || 0].rarity.value)} opacity-20 rounded-2xl`} />
                    <img
                      src={
                        modalData.entry.brItems[modalData.itemIndex || 0].images.featured || 
                        modalData.entry.brItems[modalData.itemIndex || 0].images.icon
                      }
                      alt={modalData.entry.brItems[modalData.itemIndex || 0].name}
                      className="w-full h-96 object-cover rounded-2xl"
                    />
                    <div className="absolute bottom-6 left-6 right-6">
                      <Badge className={`bg-gradient-to-r ${getRarityColor(modalData.entry.brItems[modalData.itemIndex || 0].rarity.value)} text-white mb-3`}>
                        {modalData.entry.brItems[modalData.itemIndex || 0].rarity.displayValue}
                      </Badge>
                      <h3 className="text-2xl font-bold text-white">
                        {modalData.entry.brItems[modalData.itemIndex || 0].type.displayValue}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2 flex flex-col justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-white mb-4">
                        {modalData.entry.brItems[modalData.itemIndex || 0].name}
                      </h2>
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                        {modalData.entry.brItems[modalData.itemIndex || 0].description || "Un objet cosmétique exclusif pour personnaliser votre expérience Fortnite avec style."}
                      </p>
                      <div className="flex items-center gap-4 mb-8 p-4 bg-black/30 rounded-2xl">
                        <img src={data.vbuckIcon} alt="V-Bucks" className="h-10 w-10" />
                        <div>
                          <span className="text-4xl font-black text-white">
                            {modalData.entry.finalPrice ?? modalData.entry.regularPrice}
                          </span>
                          <span className="text-yellow-400 ml-2 font-bold">V-Bucks</span>
                          <p className="text-gray-400 text-sm">Pack complet</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-xs space-y-2 bg-black/30 p-4 rounded-2xl border border-white/10">
                        <div className="flex justify-between text-gray-400">
                          <span>OfferId:</span>
                          <span className="font-mono text-white">{modalData.entry.offerId}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Date in:</span>
                          <span className="text-white">{formatDate(modalData.entry.inDate)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Date out:</span>
                          <span className="text-white">{formatDate(modalData.entry.outDate)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Giftable:</span>
                          <span className="text-white">{modalData.entry.giftable ? "Oui" : "Non"}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Refundable:</span>
                          <span className="text-white">{modalData.entry.refundable ? "Oui" : "Non"}</span>
                        </div>
                      </div>
                      <a
                        href={`https://www.epicgames.com/fortnite/marketplace/item/${modalData.entry.brItems[modalData.itemIndex || 0].id}`}
                        target="_blank"
                        className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-4 rounded-2xl text-white font-bold text-center uppercase tracking-wide transition-all duration-300"
                      >
                        Voir sur le site Epic Games
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Single item modal view
              <div className="lg:flex">
                <div className="relative lg:w-1/2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(modalData.entry.brItems![0].rarity.value)} opacity-20`} />
                  <img
                    src={
                      modalData.entry.brItems![0].images.featured || modalData.entry.brItems![0].images.icon
                    }
                    alt={modalData.entry.brItems![0].name}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute bottom-6 left-6 right-6">
                    <Badge className={`bg-gradient-to-r ${getRarityColor(modalData.entry.brItems![0].rarity.value)} text-white mb-3`}>
                      {modalData.entry.brItems![0].rarity.displayValue}
                    </Badge>
                    <h3 className="text-2xl font-bold text-white">
                      {modalData.entry.brItems![0].type.displayValue}
                    </h3>
                  </div>
                </div>
                <div className="lg:w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    <h2 className="text-4xl font-black text-white mb-4">
                      {modalData.entry.brItems![0].name}
                    </h2>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                      {modalData.entry.brItems![0].description || "Un objet cosmétique exclusif pour Fortnite."}
                    </p>
                    <div className="flex items-center gap-4 mb-8 p-4 bg-black/30 rounded-2xl">
                      <img src={data.vbuckIcon} alt="V-Bucks" className="h-10 w-10" />
                      <div>
                        <span className="text-4xl font-black text-white">
                          {modalData.entry.finalPrice ?? modalData.entry.regularPrice}
                        </span>
                        <span className="text-yellow-400 ml-2 font-bold">V-Bucks</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-xs space-y-2 bg-black/30 p-4 rounded-2xl border border-white/10">
                      <div className="flex justify-between text-gray-400">
                        <span>OfferId:</span>
                        <span className="font-mono text-white">{modalData.entry.offerId}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Date in:</span>
                        <span className="text-white">{formatDate(modalData.entry.inDate)}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Date out:</span>
                        <span className="text-white">{formatDate(modalData.entry.outDate)}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Giftable:</span>
                        <span className="text-white">{modalData.entry.giftable ? "Oui" : "Non"}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Refundable:</span>
                        <span className="text-white">{modalData.entry.refundable ? "Oui" : "Non"}</span>
                      </div>
                    </div>
                    <a
                      href={`https://www.epicgames.com/fortnite/marketplace/item/${modalData.entry.brItems![0].id}`}
                      target="_blank"
                      className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-4 rounded-2xl text-white font-bold text-center uppercase tracking-wide transition-all duration-300"
                    >
                      Voir sur le site Epic Games
                    </a>
                  </div>
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
