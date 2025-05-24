
import { Search, X, Tag, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  rarity: string;
  setRarity: (rarity: string) => void;
  itemCount: number;
  clearFilters: () => void;
}

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
    default:
      return 'from-gray-400 to-gray-600';
  }
};

export function SearchFilters({ search, setSearch, rarity, setRarity, itemCount, clearFilters }: SearchFiltersProps) {
  return (
    <div className="px-6 py-8 bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-lg border-b border-gray-600/50 shadow-xl">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-2 rounded-xl">
              <Search className="h-7 w-7 text-white" />
            </div>
            Rechercher et Filtrer
          </h2>
          <p className="text-gray-200 text-lg">Trouvez rapidement les objets que vous recherchez</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Enhanced Search Input */}
          <div className="relative group lg:col-span-2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300 h-5 w-5 group-focus-within:text-cyan-400 transition-colors" />
            <Input
              type="text"
              placeholder="Rechercher un objet par nom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-4 h-16 rounded-2xl bg-gray-800/70 backdrop-blur-sm text-white placeholder-gray-300 border-2 border-gray-600/60 focus:border-cyan-400/80 focus:ring-4 focus:ring-cyan-400/30 text-lg font-medium transition-all duration-300 shadow-lg"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors bg-gray-700/50 rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Enhanced Rarity Filter */}
          <div className="relative">
            <label className="block text-white text-sm font-semibold mb-3">
              Rareté
            </label>
            <Select value={rarity} onValueChange={(value) => setRarity(value)}>
              <SelectTrigger className="h-16 bg-gray-800/70 backdrop-blur-sm text-white border-2 border-gray-600/60 focus:border-purple-400/80 focus:ring-4 focus:ring-purple-400/30 rounded-2xl text-lg font-medium shadow-lg">
                <SelectValue placeholder="Toutes raretés" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/95 backdrop-blur-md border-gray-600/50 rounded-xl shadow-2xl">
                <SelectItem value="all" className="text-white hover:bg-gray-700/70 rounded-lg text-base">
                  Toutes raretés
                </SelectItem>
                {["common", "uncommon", "rare", "epic", "legendary"].map((r) => (
                  <SelectItem 
                    key={r} 
                    value={r}
                    className="text-white hover:bg-gray-700/70 rounded-lg capitalize text-base"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getRarityColor(r)}`} />
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Actions and Results */}
        <div className="flex flex-wrap items-center justify-between gap-6 mt-8 p-6 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-600/40 shadow-lg">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">{itemCount} objets trouvés</span>
            </div>
            {(search || rarity !== "all") && (
              <div className="flex items-center gap-3">
                <span className="text-gray-200 font-medium">Filtres actifs:</span>
                <div className="flex gap-2">
                  {search && (
                    <Badge className="bg-cyan-500/20 text-cyan-200 border-cyan-400/40 px-3 py-1 text-sm">
                      Recherche: "{search}"
                    </Badge>
                  )}
                  {rarity !== "all" && (
                    <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/40 px-3 py-1 text-sm">
                      Rareté: {rarity}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {(search || rarity !== "all") && (
            <Button
              onClick={clearFilters}
              variant="outline" 
              className="bg-gray-700/70 hover:bg-gray-600/70 text-white border-gray-500/60 hover:border-gray-400/70 rounded-xl backdrop-blur-sm transition-all duration-300 px-6 py-3 font-medium"
            >
              <FilterX className="mr-2 h-5 w-5" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
