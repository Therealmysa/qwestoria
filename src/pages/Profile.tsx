
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { secureUploadToCloudinary } from "@/services/cloudinarySecure";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Loader2, Upload, User, Trophy, Flame, Coins,
  AlertCircle, CheckCircle2, CircleHelp, Monitor, Smartphone, Gamepad
} from "lucide-react";

const fortniteRanks = [
  { value: "bronze", label: "Bronze", color: "rank-bronze" },
  { value: "silver", label: "Argent", color: "rank-silver" },
  { value: "gold", label: "Or", color: "rank-gold" },
  { value: "platinum", label: "Platine", color: "rank-platinum" },
  { value: "diamond", label: "Diamant", color: "rank-diamond" },
  { value: "elite", label: "Elite", color: "rank-elite" },
  { value: "champion", label: "Champion", color: "rank-champion" },
  { value: "unreal", label: "Unreal", color: "rank-unreal" },
];

const gamingPlatforms = [
  { value: "pc", label: "PC", icon: Monitor },
  { value: "playstation", label: "PlayStation", icon: Gamepad },
  { value: "xbox", label: "Xbox", icon: Gamepad },
  { value: "switch", label: "Nintendo Switch", icon: Gamepad },
  { value: "mobile", label: "Mobile", icon: Smartphone },
];

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isInitialSetup = searchParams.get('setup') === 'initial';
  
  const [formData, setFormData] = useState({
    username: "",
    fortniteUsername: "",
    bio: "",
    fortniteRank: "",
    platform: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    missions: 0,
    coins: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (profile) {
      setFormData({
        username: profile.username || "",
        fortniteUsername: profile.fortnite_username || "",
        bio: profile.bio || "",
        fortniteRank: profile.fortnite_rank || "",
        platform: profile.platform || "",
      });
      fetchUserStats();
      setIsLoading(false);
    }
  }, [user, profile, loading, navigate]);

  const fetchUserStats = async () => {
    if (!user) return;
    
    try {
      // Fetch missions count
      const { data: missionsData, error: missionsError } = await supabase
        .from("mission_submissions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "verified");
      
      if (missionsError) throw missionsError;
      
      // Fetch coins
      const { data: coinsData, error: coinsError } = await supabase
        .from("brad_coins")
        .select("balance")
        .eq("user_id", user.id)
        .single();
      
      if (coinsError) throw coinsError;
      
      setUserStats({
        missions: missionsData?.length || 0,
        coins: coinsData?.balance || 0
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      let avatarUrl = profile?.avatar_url;
      
      // Upload avatar if changed
      if (avatarFile) {
        try {
          avatarUrl = await secureUploadToCloudinary(avatarFile);
        } catch (error) {
          console.error("Error uploading avatar:", error);
          toast.error("Échec du téléchargement de l'avatar. Veuillez réessayer.");
          return;
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          fortnite_username: formData.fortniteUsername,
          fortnite_rank: formData.fortniteRank,
          platform: formData.platform,
          bio: formData.bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profil mis à jour avec succès !");
      
      // If this was the initial setup, redirect to dashboard
      if (isInitialSetup) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Échec de la mise à jour du profil");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFieldComplete = (field: string) => {
    return formData[field as keyof typeof formData]?.trim().length > 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
      </div>
    );
  }

  const getRankColor = (rank: string) => {
    return fortniteRanks.find(r => r.value === rank)?.color || '';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isInitialSetup && (
        <Alert className="mb-8 border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/30">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Configuration initiale du profil</AlertTitle>
          <AlertDescription>
            Merci de compléter votre profil pour accéder à toutes les fonctionnalités de la plateforme.
          </AlertDescription>
        </Alert>
      )}
      
      <h1 className="mb-6 text-3xl font-bold text-[#9b87f5]">
        {isInitialSetup ? "Configuration du profil" : "Mon Profil"}
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Stats Cards - Only show if not initial setup */}
        {!isInitialSetup && (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Card className="card-enhanced text-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[#9b87f5]" />
                  Niveau de joueur
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xl font-bold">
                      {formData.fortniteRank ? (
                        <span className={`badge-rank ${getRankColor(formData.fortniteRank)}`}>
                          {fortniteRanks.find(r => r.value === formData.fortniteRank)?.label || 'Non défini'}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Non défini</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Rang Fortnite</p>
                  </div>
                  <div className="h-12 w-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    {formData.fortniteRank ? (
                      <CheckCircle2 className="h-6 w-6 text-[#9b87f5]" />
                    ) : (
                      <CircleHelp className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced text-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Missions complétées
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-3xl font-bold">{userStats.missions}</div>
                    <p className="text-sm text-muted-foreground mt-1">Missions validées</p>
                  </div>
                  <div className="h-12 w-12 flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 rounded-full">
                    <Trophy className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced text-foreground">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Coins className="h-5 w-5 text-amber-500" />
                  BradCoins
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-3xl font-bold">{userStats.coins}</div>
                    <p className="text-sm text-muted-foreground mt-1">Solde actuel</p>
                  </div>
                  <div className="h-12 w-12 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <Coins className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="lg:col-span-2 card-enhanced text-foreground">
          <CardHeader>
            <CardTitle>{isInitialSetup ? "Informations requises" : "Informations du profil"}</CardTitle>
            <CardDescription>
              {isInitialSetup 
                ? "Ces informations sont nécessaires pour utiliser la plateforme" 
                : "Mettez à jour vos informations personnelles"
              }
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-1">
                    Nom d'utilisateur
                    {isInitialSetup && !isFieldComplete("username") && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input-enhanced"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fortniteUsername" className="flex items-center gap-1">
                    Nom d'utilisateur Fortnite
                    {isInitialSetup && !isFieldComplete("fortniteUsername") && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <Input
                    id="fortniteUsername"
                    name="fortniteUsername"
                    value={formData.fortniteUsername}
                    onChange={handleChange}
                    className="input-enhanced"
                    required={isInitialSetup}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="platform" className="flex items-center gap-1">
                    Plateforme de jeu
                  </Label>
                  <Select 
                    value={formData.platform} 
                    onValueChange={(value) => handleSelectChange("platform", value)}
                  >
                    <SelectTrigger className="input-enhanced">
                      <SelectValue placeholder="Sélectionnez votre plateforme" />
                    </SelectTrigger>
                    <SelectContent>
                      {gamingPlatforms.map((platform) => {
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
                  <Label htmlFor="fortniteRank" className="flex items-center gap-1">
                    Rang Fortnite
                  </Label>
                  <Select 
                    value={formData.fortniteRank} 
                    onValueChange={(value) => handleSelectChange("fortniteRank", value)}
                  >
                    <SelectTrigger className="input-enhanced">
                      <SelectValue placeholder="Sélectionnez votre rang" />
                    </SelectTrigger>
                    <SelectContent>
                      {fortniteRanks.map((rank) => (
                        <SelectItem key={rank.value} value={rank.value}>
                          <div className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${rank.color.replace('text-', 'bg-')}`}></span>
                            {rank.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center gap-1">
                    Bio
                    {isInitialSetup && !isFieldComplete("bio") && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="input-enhanced h-32 resize-none"
                    placeholder="Parlez-nous un peu de vous..."
                    required={isInitialSetup}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit"
                className="bg-[#9b87f5] hover:bg-[#8976e4]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    {isInitialSetup ? "Configuration en cours..." : "Enregistrement..."}
                  </>
                ) : (
                  isInitialSetup ? "Terminer la configuration" : "Enregistrer les modifications"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="card-enhanced text-foreground">
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>
              Votre photo de profil
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 ring-2 ring-offset-2 ring-purple-200 dark:ring-purple-800">
              <AvatarImage 
                src={avatarPreview || profile?.avatar_url || ''} 
                alt={profile?.username || 'Avatar'} 
              />
              <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-2xl">
                <User className="h-12 w-12 text-purple-500 dark:text-purple-300" />
              </AvatarFallback>
            </Avatar>
            
            <Label 
              htmlFor="avatar-upload" 
              className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center justify-center w-full transition-colors"
            >
              <Upload className="mr-2 h-4 w-4" />
              Changer l'avatar
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <p className="text-xs text-muted-foreground">
              Formats acceptés : JPG, PNG, GIF. Taille maximale : 2MB.
            </p>
            {profile?.is_vip && (
              <span className="mt-2 bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs px-2 py-1 rounded-full">
                Membre VIP
              </span>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
