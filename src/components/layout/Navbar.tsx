
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
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
  UserPlus,
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

  return (
    <nav className="sticky top-0 z-50 bg-white px-4 py-3 shadow-md border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-blue-600">
            Qwestoria
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden space-x-1 md:flex">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/")
                ? "text-blue-600 font-medium"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Accueil
          </Link>
          <Link
            to="/missions"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/missions")
                ? "text-blue-600 font-medium"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Missions
          </Link>
          <Link
            to="/teammates"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/teammates")
                ? "text-blue-600 font-medium"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Coéquipiers
          </Link>
          <Link
            to="/messages"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/messages")
                ? "text-blue-600 font-medium"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Messagerie
          </Link>
          <Link
            to="/shop"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/shop")
                ? "text-blue-600 font-medium"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Boutique
          </Link>
          <Link
            to="/blog"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/blog")
                ? "text-blue-600 font-medium"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Blog
          </Link>
          <Link
            to="/referral"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/referral")
                ? "text-blue-600 font-medium"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Parrainage
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative h-10 w-10 rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-white border-gray-200 text-gray-700 w-56 mr-4"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="flex items-center">
                <span className="font-bold text-blue-600">
                  Navigation
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem
                onClick={() => navigate("/")}
                className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer text-gray-700"
              >
                Accueil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/missions")}
                className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer text-gray-700"
              >
                Missions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/blog")}
                className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer text-gray-700"
              >
                Blog
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/teammates")}
                className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer text-gray-700"
              >
                Coéquipiers
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/messages")}
                className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer text-gray-700"
              >
                Messagerie
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/shop")}
                className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer text-gray-700"
              >
                Boutique
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/referral")}
                className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer text-gray-700"
              >
                <UserPlus className="h-4 w-4 mr-2" /> Parrainage
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem
                onClick={() => navigate("/leaderboard")}
                className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer text-gray-700"
              >
                <Trophy className="h-4 w-4 mr-2" /> Classement
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
              className="rounded-full hover:bg-gray-100 text-gray-700"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5" />
            </Button>
          )}

          {/* User Authentication Section */}
          {!loading &&
            (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:bg-blue-50 flex items-center rounded-full gap-2 p-2 pr-3"
                  >
                    <Avatar className="h-8 w-8 border border-blue-200">
                      {profile?.avatar_url ? (
                        <AvatarImage
                          src={profile.avatar_url}
                          alt={profile?.username || "User"}
                        />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {profile?.username
                            ? profile.username.substring(0, 2).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {!isMobile && (
                      <span className="font-medium text-gray-900">
                        {profile?.username ||
                          user.email?.split("@")[0] ||
                          "User"}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-gray-200 text-gray-700">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {profile?.username ||
                          user.email?.split("@")[0] ||
                          "User"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer flex items-center text-gray-700"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer flex items-center text-gray-700"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/missions")}
                    className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer flex items-center text-gray-700"
                  >
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Missions
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/friends")}
                    className="focus:bg-blue-50 focus:text-blue-600 cursor-pointer flex items-center text-gray-700"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Amis
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
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
