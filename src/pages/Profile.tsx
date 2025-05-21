
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2, Upload, User } from "lucide-react";

const Profile = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fortniteUsername: "",
    bio: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (profile) {
      setFormData({
        username: profile.username || "",
        fortniteUsername: profile.fortnite_username || "",
        bio: profile.bio || "",
      });
      setIsLoading(false);
    }
  }, [user, profile, loading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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
          toast.error("Failed to upload avatar. Please try again.");
          return;
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          fortnite_username: formData.fortniteUsername,
          bio: formData.bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#9b87f5]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#9b87f5]">Mon Profil</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-[#9b87f5]/50 bg-[#221F26] text-white">
          <CardHeader>
            <CardTitle>Informations du profil</CardTitle>
            <CardDescription className="text-gray-400">
              Mettez à jour vos informations personnelles
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-[#1A191C] border-gray-700"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fortniteUsername">Nom d'utilisateur Fortnite</Label>
                  <Input
                    id="fortniteUsername"
                    name="fortniteUsername"
                    value={formData.fortniteUsername}
                    onChange={handleChange}
                    className="bg-[#1A191C] border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="bg-[#1A191C] border-gray-700 h-32 resize-none"
                    placeholder="Parlez-nous un peu de vous..."
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
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="border-[#9b87f5]/50 bg-[#221F26] text-white">
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription className="text-gray-400">
              Votre photo de profil
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage 
                src={avatarPreview || profile?.avatar_url || ''} 
                alt={profile?.username || 'Avatar'} 
              />
              <AvatarFallback className="bg-[#1A191C] text-2xl">
                <User className="h-12 w-12 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            
            <Label 
              htmlFor="avatar-upload" 
              className="cursor-pointer bg-[#1A191C] hover:bg-[#2A292C] text-white px-4 py-2 rounded-md flex items-center justify-center w-full"
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
            <p className="text-xs text-gray-400">
              Formats acceptés : JPG, PNG, GIF. Taille maximale : 2MB.
            </p>
            {profile?.is_vip && (
              <span className="mt-2 bg-amber-500/20 text-amber-300 text-xs px-2 py-1 rounded-full">
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
