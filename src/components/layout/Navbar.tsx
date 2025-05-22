
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { 
  Menu, 
  ChevronDown, 
  User, 
  LogOut,
  LayoutDashboard,
  BadgeCheck,
  MessageSquare,
  BookOpen,
  Trophy,
  ShoppingBag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import RankBadge from "@/components/rank/RankBadge";
import { getRankByPoints } from "@/utils/rankUtils";

const Navbar = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    console.log("Navbar: Logout button clicked");
    try {
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      console.error("Navbar: Logout error", error);
      toast.error(
        error.message || "Une erreur est survenue lors de la déconnexion"
      );
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Calculate user rank from profile data
  const userPoints = profile?.coins || 0;  // Changed to use optional chaining since coins might not exist
  const userRank = getRankByPoints(userPoints);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#1A1F2C] px-4 py-3 shadow-md border-b border-gray-100 dark:border-gray-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary dark:text-[#9b87f5]">BradFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden space-x-1 md:flex">
          <Link to="/" className={`px-3 py-2 rounded-md transition-colors ${isActive("/") ? "text-primary font-medium dark:text-[#9b87f5]" : "text-gray-600 hover:text-primary dark:text-gray-200 dark:hover:text-[#9b87f5]"}`}>
            Accueil
          </Link>
          <Link to="/missions" className={`px-3 py-2 rounded-md transition-colors ${isActive("/missions") ? "text-primary font-medium dark:text-[#9b87f5]" : "text-gray-600 hover:text-primary dark:text-gray-200 dark:hover:text-[#9b87f5]"}`}>
            Missions
          </Link>
          <Link to="/blog" className={`px-3 py-2 rounded-md transition-colors ${isActive("/blog") ? "text-primary font-medium dark:text-[#9b87f5]" : "text-gray-600 hover:text-primary dark:text-gray-200 dark:hover:text-[#9b87f5]"}`}>
            Blog
          </Link>
          <Link to="/messages" className={`px-3 py-2 rounded-md transition-colors ${isActive("/messages") ? "text-primary font-medium dark:text-[#9b87f5]" : "text-gray-600 hover:text-primary dark:text-gray-200 dark:hover:text-[#9b87f5]"}`}>
            Messagerie
          </Link>
          <Link to="/shop" className={`px-3 py-2 rounded-md transition-colors ${isActive("/shop") ? "text-primary font-medium dark:text-[#9b87f5]" : "text-gray-600 hover:text-primary dark:text-gray-200 dark:hover:text-[#9b87f5]"}`}>
            Boutique
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-[#1A1F2C] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-white w-56">
              <DropdownMenuLabel className="flex items-center">
                <span className="font-bold text-primary dark:text-[#9b87f5]">Navigation</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem onClick={() => navigate("/")} className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer">
                Accueil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/missions")} className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer">
                Missions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/blog")} className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer">
                Blog
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/messages")} className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer">
                Messagerie
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/shop")} className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer">
                Boutique
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem onClick={() => navigate("/fortnite-shop")} className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer">
                <ShoppingBag className="h-4 w-4 mr-2" /> Boutique Fortnite
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/leaderboard")} className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer">
                <Trophy className="h-4 w-4 mr-2" /> Classement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2">
          {!loading &&
            (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-primary dark:text-[#9b87f5] hover:bg-primary/10 dark:hover:bg-[#9b87f5]/20 flex items-center rounded-full gap-2">
                    <Avatar className="h-8 w-8 border border-primary/20 dark:border-[#9b87f5]/30">
                      {profile?.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} alt={profile?.username || "User"} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 dark:bg-[#9b87f5]/20 text-primary dark:text-[#9b87f5]">
                          {profile?.username ? profile.username.substring(0, 2).toUpperCase() : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="hidden sm:inline">{profile?.username || user.email?.split("@")[0] || "User"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-[#1A1F2C] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-white">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{profile?.username || user.email?.split("@")[0] || "User"}</span>
                      <div className="flex items-center mt-1">
                        <RankBadge rankTier={userRank} showText={true} size="sm" />
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={() => navigate("/profile")}
                    className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/dashboard")}
                    className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer flex items-center"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/missions")}
                    className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer flex items-center"
                  >
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Missions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-500 focus:bg-red-500/10 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-500/10 dark:focus:text-red-300 cursor-pointer flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#8976e4] text-white rounded-full">
                  Connexion
                </Button>
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
