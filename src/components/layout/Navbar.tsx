
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
    <nav className="sticky top-0 z-50 bg-background px-4 py-3 border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary">
            Qwestoria
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden space-x-1 md:flex">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Accueil
          </Link>
          <Link
            to="/missions"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/missions")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Missions
          </Link>
          <Link
            to="/teammates"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/teammates")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Coéquipiers
          </Link>
          <Link
            to="/messages"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/messages")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Messagerie
          </Link>
          <Link
            to="/shop"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/shop")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Boutique
          </Link>
          <Link
            to="/blog"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/blog")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            Blog
          </Link>
          <Link
            to="/referral"
            className={`px-3 py-2 rounded-md transition-colors ${
              isActive("/referral")
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
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
                className="relative h-10 w-10 rounded-lg"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 mr-4"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="flex items-center">
                <span className="font-bold text-primary">
                  Navigation
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/")}
                className="cursor-pointer"
              >
                Accueil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/missions")}
                className="cursor-pointer"
              >
                Missions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/blog")}
                className="cursor-pointer"
              >
                Blog
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/teammates")}
                className="cursor-pointer"
              >
                Coéquipiers
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/messages")}
                className="cursor-pointer"
              >
                Messagerie
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/shop")}
                className="cursor-pointer"
              >
                Boutique
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/referral")}
                className="cursor-pointer"
              >
                <UserPlus className="h-4 w-4 mr-2" /> Parrainage
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/leaderboard")}
                className="cursor-pointer"
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
              className="rounded-full"
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
                    className="hover:bg-accent flex items-center rounded-full gap-2 p-2 pr-3"
                  >
                    <Avatar className="h-8 w-8 border">
                      {profile?.avatar_url ? (
                        <AvatarImage
                          src={profile.avatar_url}
                          alt={profile?.username || "User"}
                        />
                      ) : (
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {profile?.username
                            ? profile.username.substring(0, 2).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {!isMobile && (
                      <span className="font-medium text-foreground">
                        {profile?.username ||
                          user.email?.split("@")[0] ||
                          "User"}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {profile?.username ||
                          user.email?.split("@")[0] ||
                          "User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="cursor-pointer flex items-center"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/missions")}
                    className="cursor-pointer flex items-center"
                  >
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Missions
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/friends")}
                    className="cursor-pointer flex items-center"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Amis
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="rounded-full">
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
