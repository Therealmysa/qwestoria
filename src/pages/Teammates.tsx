import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Users,
  Search,
  Filter,
  Gamepad,
  Headphones,
  Mic,
  Monitor,
  Smartphone,
  Clock,
  CalendarClock,
  Loader2,
} from "lucide-react";

interface TeammatePost {
  id: string;
  user_id: string;
  title: string;
  description: string;
  game_mode: string;
  platform: string;
  mic_required: boolean;
  skill_level: string;
  created_at: string;
  availability: string;
  profile: {
    username: string;
    avatar_url: string | null;
    fortnite_rank: string | null;
  };
}

const skillLevels = [
  { value: "beginner", label: "Débutant" },
  { value: "intermediate", label: "Intermédiaire" },
  { value: "advanced", label: "Avancé" },
  { value: "expert", label: "Expert" }
];

const gameModes = [
  { value: "battle-royale", label: "Battle Royale" },
  { value: "zero-build", label: "Zero Build" },
  { value: "creative", label: "Créatif" },
  { value: "save-the-world", label: "Sauver le Monde" }
];

const platforms = [
  { value: "pc", label: "PC", icon: Monitor },
  { value: "playstation", label: "PlayStation", icon: Gamepad },
  { value: "xbox", label: "Xbox", icon: Gamepad },
  { value: "switch", label: "Nintendo Switch", icon: Gamepad },
  { value: "mobile", label: "Mobile", icon: Smartphone }
];

const Teammates = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<TeammatePost[]>([]);
  const [myPosts, setMyPosts] = useState<TeammatePost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    gameMode: "",
    platform: "",
    skillLevel: "",
    micRequired: false
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    gameMode: "battle-royale",
    platform: "",
    micRequired: true,
    skillLevel: "intermediate",
    availability: "anytime"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("teammate_posts")
        .select(`
          *,
          profile:user_id (
            username,
            avatar_url,
            fortnite_rank
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const allPosts = data as TeammatePost[];
      setPosts(allPosts.filter(post => post.user_id !== user?.id));
      setMyPosts(allPosts.filter(post => post.user_id === user?.id));
      
    } catch (error) {
      console.error("Error fetching teammate posts:", error);
      toast.error("Impossible de charger les annonces de coéquipiers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour poster une annonce");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from("teammate_posts")
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            game_mode: formData.gameMode,
            platform: formData.platform || profile?.platform || "",
            mic_required: formData.micRequired,
            skill_level: formData.skillLevel,
            availability: formData.availability
          }
        ])
        .select();

      if (error) throw error;
      
      toast.success("Annonce publiée avec succès !");
      fetchPosts();
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        gameMode: "battle-royale",
        platform: profile?.platform || "",
        micRequired: true,
        skillLevel: "intermediate",
        availability: "anytime"
      });
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Impossible de créer l'annonce");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("teammate_posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", user?.id);

      if (error) throw error;
      
      toast.success("Annonce supprimée avec succès");
      fetchPosts();
      
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Impossible de supprimer l'annonce");
    }
  };

  const handleContactPlayer = (postId: string, username: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour contacter un joueur");
      return;
    }

    // This would normally open a messaging interface or send a friend request
    toast.success(`Demande envoyée à ${username}`);
  };

  const getFilteredPosts = () => {
    return posts.filter(post => {
      // Search filter
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.profile.username.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Other filters
      const matchesGameMode = filters.gameMode ? post.game_mode === filters.gameMode : true;
      const matchesPlatform = filters.platform ? post.platform === filters.platform : true;
      const matchesSkill = filters.skillLevel ? post.skill_level === filters.skillLevel : true;
      const matchesMic = filters.micRequired ? post.mic_required === true : true;
      
      return matchesSearch && matchesGameMode && matchesPlatform && matchesSkill && matchesMic;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { 
      day: "2-digit", 
      month: "short", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case "anytime": return "À tout moment";
      case "evenings": return "En soirée";
      case "weekends": return "Weekends";
      case "scheduled": return "Sur rendez-vous";
      default: return availability;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-[#9b87f5]">
            Recherche de Coéquipiers
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Trouvez des coéquipiers pour jouer à Fortnite ensemble
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#8976e4]">
              <Users className="mr-2 h-4 w-4" /> Poster une annonce
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Chercher des coéquipiers</DialogTitle>
              <DialogDescription>
                Décrivez ce que vous recherchez pour trouver les meilleurs coéquipiers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce</Label>
                <Input 
                  id="title" 
                  placeholder="Ex: Cherche duo pour Arena" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Décrivez ce que vous recherchez, votre style de jeu, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gameMode">Mode de jeu</Label>
                  <Select 
                    value={formData.gameMode}
                    onValueChange={(value) => setFormData({...formData, gameMode: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Mode de jeu" />
                    </SelectTrigger>
                    <SelectContent>
                      {gameModes.map(mode => (
                        <SelectItem key={mode.value} value={mode.value}>
                          {mode.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Plateforme</Label>
                  <Select 
                    value={formData.platform}
                    onValueChange={(value) => setFormData({...formData, platform: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Plateforme" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(platform => {
                        const Icon = platform.icon;
                        return (
                          <SelectItem key={platform.value} value={platform.value}>
                            <div className="flex items-center">
                              <Icon className="mr-2 h-4 w-4" />
                              {platform.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="skillLevel">Niveau</Label>
                  <Select 
                    value={formData.skillLevel}
                    onValueChange={(value) => setFormData({...formData, skillLevel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Disponibilité</Label>
                  <Select 
                    value={formData.availability}
                    onValueChange={(value) => setFormData({...formData, availability: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Disponibilité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anytime">À tout moment</SelectItem>
                      <SelectItem value="evenings">En soirée</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="scheduled">Sur rendez-vous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="micRequired" 
                  checked={formData.micRequired}
                  onChange={(e) => setFormData({...formData, micRequired: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="micRequired" className="text-sm font-medium">
                  Microphone requis
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleCreatePost}
                disabled={isSubmitting || !formData.title.trim()}
                className="bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#8976e4]"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création...</>
                ) : (
                  "Publier l'annonce"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filtres
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filtres</DialogTitle>
                <DialogDescription>
                  Affinez votre recherche avec ces filtres
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="filterGameMode">Mode de jeu</Label>
                  <Select 
                    value={filters.gameMode}
                    onValueChange={(value) => setFilters({...filters, gameMode: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les modes de jeu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les modes</SelectItem>
                      {gameModes.map(mode => (
                        <SelectItem key={mode.value} value={mode.value}>
                          {mode.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filterPlatform">Plateforme</Label>
                  <Select 
                    value={filters.platform}
                    onValueChange={(value) => setFilters({...filters, platform: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les plateformes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les plateformes</SelectItem>
                      {platforms.map(platform => {
                        const Icon = platform.icon;
                        return (
                          <SelectItem key={platform.value} value={platform.value}>
                            <div className="flex items-center">
                              <Icon className="mr-2 h-4 w-4" />
                              {platform.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filterSkillLevel">Niveau</Label>
                  <Select 
                    value={filters.skillLevel}
                    onValueChange={(value) => setFilters({...filters, skillLevel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les niveaux" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les niveaux</SelectItem>
                      {skillLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="filterMicRequired" 
                    checked={filters.micRequired}
                    onChange={(e) => setFilters({...filters, micRequired: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="filterMicRequired" className="text-sm font-medium">
                    Micro requis uniquement
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({gameMode: "", platform: "", skillLevel: "", micRequired: false})}
                  className="mr-2"
                >
                  Réinitialiser
                </Button>
                <DialogTrigger asChild>
                  <Button>Appliquer</Button>
                </DialogTrigger>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="browse">
        <TabsList className="mb-6">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Parcourir les annonces
          </TabsTrigger>
          <TabsTrigger value="myposts" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Mes annonces
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-[#9b87f5]" />
              <span className="ml-2 text-gray-500 dark:text-gray-400">Chargement...</span>
            </div>
          ) : getFilteredPosts().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredPosts().map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-primary/20 dark:border-[#9b87f5]/30">
                          {post.profile.avatar_url ? (
                            <AvatarImage src={post.profile.avatar_url} alt={post.profile.username} />
                          ) : (
                            <AvatarFallback className="bg-primary/10 dark:bg-[#9b87f5]/20 text-primary dark:text-[#9b87f5] text-xs">
                              {post.profile.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{post.profile.username}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            {post.profile.fortnite_rank && (
                              <Badge variant="secondary" className="text-xs">
                                {post.profile.fortnite_rank.charAt(0).toUpperCase() + post.profile.fortnite_rank.slice(1)}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs bg-primary/5 dark:bg-[#9b87f5]/5">
                              {skillLevels.find(level => level.value === post.skill_level)?.label || post.skill_level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-2">
                    <h3 className="font-semibold text-base mb-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{post.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Gamepad className="h-3.5 w-3.5 mr-1.5" />
                        {gameModes.find(mode => mode.value === post.game_mode)?.label || post.game_mode}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        {(() => {
                          const platform = platforms.find(p => p.value === post.platform);
                          const Icon = platform?.icon || Monitor;
                          return (
                            <>
                              <Icon className="h-3.5 w-3.5 mr-1.5" />
                              {platform?.label || post.platform || "Toutes plateformes"}
                            </>
                          );
                        })()}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        {post.mic_required ? (
                          <>
                            <Headphones className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            Micro requis
                          </>
                        ) : (
                          <>
                            <Mic className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            Micro optionnel
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
                        {getAvailabilityLabel(post.availability)}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400 flex items-center mt-3">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      {formatDate(post.created_at)}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-3">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#8976e4]"
                      onClick={() => handleContactPlayer(post.id, post.profile.username)}
                    >
                      Contacter le joueur
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 dark:bg-[#9b87f5]/20 mb-4">
                <Users className="h-6 w-6 text-primary dark:text-[#9b87f5]" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                Aucune annonce trouvée
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Il n'y a aucune annonce correspondant à vos critères pour le moment.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#8976e4]">
                    Soyez le premier à poster
                  </Button>
                </DialogTrigger>
                {/* Reuse the same dialog content as above */}
              </Dialog>
            </div>
          )}
        </TabsContent>

        <TabsContent value="myposts">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-[#9b87f5]" />
              <span className="ml-2 text-gray-500 dark:text-gray-400">Chargement...</span>
            </div>
          ) : myPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{formatDate(post.created_at)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{post.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Gamepad className="h-3.5 w-3.5 mr-1.5" />
                        {gameModes.find(mode => mode.value === post.game_mode)?.label || post.game_mode}
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        {(() => {
                          const platform = platforms.find(p => p.value === post.platform);
                          const Icon = platform?.icon || Monitor;
                          return (
                            <>
                              <Icon className="h-3.5 w-3.5 mr-1.5" />
                              {platform?.label || post.platform || "Toutes plateformes"}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-3">
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Supprimer
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 dark:bg-[#9b87f5]/20 mb-4">
                <User className="h-6 w-6 text-primary dark:text-[#9b87f5]" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                Vous n'avez pas encore posté d'annonce
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Créez votre première annonce pour trouver des coéquipiers
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#8976e4]">
                    Créer une annonce
                  </Button>
                </DialogTrigger>
                {/* Reuse the same dialog content as above */}
              </Dialog>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Teammates;
