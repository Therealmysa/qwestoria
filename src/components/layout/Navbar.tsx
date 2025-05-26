import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/components/theme/theme-provider";
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
  ShoppingBag,
  Users,
  Bell,
  Sun,
  Moon,
  Monitor,
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

const Navbar = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { setTheme, theme } = useTheme();

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

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#1A1F2C] px-4 py-3 shadow-md border-b border-gray-100 dark:border-gray-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary dark:text-[#9b87f5]">
            Qwestoria
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden space-x-1 md:flex">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/")
                ? "text-primary font-medium dark:text-[#9b87f5]"
                : "text-gray-600 hover:text-primary dark:text-gray-200 dark:hover:text-[#9b87f5]"
            }`}
          >
            Accueil
          </Link>
          <Link
            to="/missions"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/missions")
                ? "text-primary font-medium dark:text-[#9b87f5]"
                : "text-gray-600 hover:text-primary dark:text-gray-200 dark:hover:text-[#9b87f5]"
            }`}
          >
            Missions
          </Link>

          <Link
            to="/teammates"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/teammates")
                ? "text-primary font-medium dark:text-[#9b87f5]"
                : "text-gray-600 hover:text-primary dark:text-gray-200 dark:hover:text-[#9b87f5]"
            }`}
          >
            Coéquipiers
          </Link>
          <Link
            to="/messages"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/messages")
                ? "text-primary font-medium dark:text-[#9b87f5]"
                : "text-gray-600 hover:text-primary dark:text-gray-200 dark:hover:text-[#9b87f5]"
            }`}
          >
            Messagerie
          </Link>
          <Link
            to="/shop"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/shop")
                ? "text-primary font-medium dark:text-[#9b87f5]"
                : "text-gray-600 hover:text-primary dark:text-gray-200 dark:hover:text-[#9b87f5]"
            }`}
          >
            Boutique
          </Link>
          <Link
            to="/blog"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/blog")
                ? "text-primary font-medium dark:text-[#9b87f5]"
                : "text-gray-600 hover:text-primary dark:text-gray-200 dark:hover:text-[#9b87f5]"
            }`}
          >
            Blog
          </Link>
        </div>

        {/* Mobile Navigation - Improved hamburger menu with theme toggle */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative h-10 w-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary dark:hover:border-[#9b87f5] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-white dark:bg-[#1A1F2C] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-white w-56 mr-4"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="flex items-center">
                <span className="font-bold text-primary dark:text-[#9b87f5]">
                  Navigation
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem
                onClick={() => navigate("/")}
                className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer"
              >
                Accueil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/missions")}
                className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer"
              >
                Missions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/blog")}
                className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer"
              >
                Blog
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/teammates")}
                className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer"
              >
                Coéquipiers
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/messages")}
                className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer"
              >
                Messagerie
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/shop")}
                className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer"
              >
                Boutique
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuItem
                onClick={() => navigate("/shop")}
                className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4 mr-2" /> Boutique
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/leaderboard")}
                className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer"
              >
                <Trophy className="h-4 w-4 mr-2" /> Classement
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
              <DropdownMenuLabel className="flex items-center">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Thème
                </span>
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer"
              >
                <Sun className="h-4 w-4 mr-2 text-amber-500" />
                Clair
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer"
              >
                <Moon className="h-4 w-4 mr-2 text-purple-400" />
                Sombre
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer"
              >
                <Monitor className="h-4 w-4 mr-2 text-gray-500" />
                Système
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2">
          {/* Notifications Button */}
          {!loading && user && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          )}

          {!loading &&
            (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-primary dark:text-[#9b87f5] hover:bg-primary/10 dark:hover:bg-[#9b87f5]/20 flex items-center rounded-full gap-2 p-2 pr-3"
                  >
                    <Avatar className="h-8 w-8 border border-primary/20 dark:border-[#9b87f5]/30">
                      {profile?.avatar_url ? (
                        <AvatarImage
                          src={profile.avatar_url}
                          alt={profile?.username || "User"}
                        />
                      ) : (
                        <AvatarFallback className="bg-primary/10 dark:bg-[#9b87f5]/20 text-primary dark:text-[#9b87f5]">
                          {profile?.username
                            ? profile.username.substring(0, 2).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {!isMobile && (
                      <span className="font-medium">
                        {profile?.username ||
                          user.email?.split("@")[0] ||
                          "User"}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-[#1A1F2C] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-white">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {profile?.username ||
                          user.email?.split("@")[0] ||
                          "User"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {user.email}
                      </span>
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
                  <DropdownMenuItem
                    onClick={() => navigate("/friends")}
                    className="focus:bg-primary/10 focus:text-primary dark:focus:bg-[#9b87f5]/20 dark:focus:text-[#9b87f5] cursor-pointer flex items-center"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Amis
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
