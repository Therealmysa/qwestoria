import { useEffect, useState } from "react";
import {
  getFortniteShop,
  FortniteShopPayload,
  RawFortniteItem,
} from "@/services/fortniteApi";
import { Loader2, Calendar, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [payload, setPayload] = useState<FortniteShopPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalData, setModalData] = useState<{
    entry: RawFortniteItem;
    item: any;
  } | null>(null);
  const [search, setSearch] = useState("");
  const [rarity, setRarity] = useState("all");
  const [showPacks, setShowPacks] = useState(false);

  useEffect(() => {
    getFortniteShop()
      .then((res) => setPayload(res))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-[#121217]">
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
  // Identify packs (entries with brItems length >1)
  const packs = data.entries.filter((e) => (e.brItems?.length || 0) > 1);
  const singles = data.entries.filter((e) => (e.brItems?.length || 0) === 1);
  const target = showPacks ? packs : singles;

  const filtered = target
    .filter((e) =>
      e.brItems!.some((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      )
    )
    .filter(
      (e) =>
        rarity === "all" || e.brItems!.some((i) => i.rarity.value === rarity)
    );

  return (
    <div className="min-h-screen bg-[#121217] text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex flex-col md:flex-row items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Calendar className="text-white" />
          <div>
            <h1 className="text-3xl font-extrabold">Boutique Fortnite</h1>
            <p className="text-sm text-gray-200">
              Mis à jour : {new Date(data.date).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Rechercher un item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#1f1f27] placeholder-gray-500 focus:outline-none w-64"
          />
          <select
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#1f1f27]"
          >
            <option value="all">Toutes raretés</option>
            {["common", "uncommon", "rare", "epic", "legendary"].map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowPacks((prev) => !prev)}
            className="px-4 py-2 rounded-lg bg-[#1f1f27] hover:bg-[#2a2b31] transition"
          >
            {showPacks ? "Voir articles seuls" : "Voir packs"}
          </button>
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((entry) =>
          entry.brItems!.map((item) => (
            <Card
              key={item.id}
              onClick={() => setModalData({ entry, item })}
              className="cursor-pointer bg-[#1f1f27] hover:shadow-2xl transition-shadow rounded-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={item.images.featured || item.images.icon}
                  alt={item.name}
                  className="w-full h-56 object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-white text-black text-sm">
                  {item.rarity.displayValue}
                </Badge>
                {entry.brItems!.length > 1 && (
                  <Badge className="absolute top-3 right-3 bg-[#9b87f5] text-white text-xs">
                    PACK
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-bold truncate mb-1">
                  {item.name}
                </CardTitle>
                <p className="text-sm text-gray-400 truncate mb-2">
                  {item.type.displayValue}
                </p>
                <p className="text-xs text-gray-300 line-clamp-3">
                  {item.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4 pt-0">
                <div className="flex items-center gap-2">
                  <img src={data.vbuckIcon} alt="V-Bucks" className="h-5 w-5" />
                  <span className="text-lg font-semibold">
                    {entry.finalPrice ?? entry.regularPrice}
                  </span>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Voir détails
                </span>
              </CardFooter>
            </Card>
          ))
        )}
      </main>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#1f1f27] rounded-lg max-w-4xl w-full overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setModalData(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            >
              <X size={28} />
            </button>
            <div className="md:flex">
              <img
                src={
                  modalData.item.images.featured || modalData.item.images.icon
                }
                alt={modalData.item.name}
                className="w-full md:w-1/2 h-80 object-cover"
              />
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {modalData.item.name}
                  </h2>
                  <Badge className="bg-white text-black mb-4 text-base">
                    {modalData.item.rarity.displayValue}
                  </Badge>
                  <p className="text-sm text-gray-300 mb-4">
                    {modalData.item.description}
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
                <div className="text-xs text-gray-500 space-y-1">
                  <div>OfferId: {modalData.entry.offerId}</div>
                  <div>Date in: {formatDate(modalData.entry.inDate)}</div>
                  <div>Date out: {formatDate(modalData.entry.outDate)}</div>
                  <div>
                    Giftable: {modalData.entry.giftable ? "Oui" : "Non"}
                  </div>
                  <div>
                    Refundable: {modalData.entry.refundable ? "Oui" : "Non"}
                  </div>
                </div>
                <a
                  href={`https://www.epicgames.com/fortnite/marketplace/item/${modalData.item.id}`}
                  target="_blank"
                  className="mt-6 self-start bg-gradient-to-r from-purple-500 to-indigo-500 px-8 py-3 rounded-lg text-white font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
                >
                  Voir sur le site
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FortniteShop;
