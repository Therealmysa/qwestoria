
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
  ShoppingBag,
  Trophy,
  Gamepad2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  return (
    <nav className="sticky top-0 z-50 bg-[#1A1F2C] px-4 py-3 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-[#9b87f5]">BradFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden space-x-1 md:flex">
          <Link to="/" className={`px-3 py-2 rounded-md ${isActive("/") ? "text-[#9b87f5]" : "text-gray-200 hover:text-[#9b87f5]"}`}>
            Accueil
          </Link>
          <Link to="/missions" className={`px-3 py-2 rounded-md ${isActive("/missions") ? "text-[#9b87f5]" : "text-gray-200 hover:text-[#9b87f5]"}`}>
            Missions
          </Link>
          <Link to="/shop" className={`px-3 py-2 rounded-md ${isActive("/shop") ? "text-[#9b87f5]" : "text-gray-200 hover:text-[#9b87f5]"}`}>
            Boutique
          </Link>
          <Link to="/fortnite-shop" className={`px-3 py-2 rounded-md ${isActive("/fortnite-shop") ? "text-[#9b87f5]" : "text-gray-200 hover:text-[#9b87f5]"}`}>
            Boutique Fortnite
          </Link>
          <Link to="/leaderboard" className={`px-3 py-2 rounded-md ${isActive("/leaderboard") ? "text-[#9b87f5]" : "text-gray-200 hover:text-[#9b87f5]"}`}>
            Classement
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-gray-700 text-gray-300">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1A1F2C] border-gray-700 text-white">
              <DropdownMenuItem onClick={() => navigate("/")} className="focus:bg-[#9b87f5]/20 focus:text-white cursor-pointer">
                Accueil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/missions")} className="focus:bg-[#9b87f5]/20 focus:text-white cursor-pointer">
                Missions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/shop")} className="focus:bg-[#9b87f5]/20 focus:text-white cursor-pointer">
                Boutique
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/fortnite-shop")} className="focus:bg-[#9b87f5]/20 focus:text-white cursor-pointer">
                Boutique Fortnite
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/leaderboard")} className="focus:bg-[#9b87f5]/20 focus:text-white cursor-pointer">
                Classement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2">
          {!loading &&
            (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-[#9b87f5] hover:bg-[#9b87f5]/20 flex items-center">
                    {profile?.username || user.email?.split("@")[0] || "User"}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1A1F2C] border-gray-700 text-white">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={() => navigate("/profile")}
                    className="focus:bg-[#9b87f5]/20 focus:text-white cursor-pointer flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/dashboard")}
                    className="focus:bg-[#9b87f5]/20 focus:text-white cursor-pointer flex items-center"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate("/missions")}
                    className="focus:bg-[#9b87f5]/20 focus:text-white cursor-pointer flex items-center"
                  >
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Missions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-400 focus:bg-red-500/20 focus:text-red-300 cursor-pointer flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-[#9b87f5] text-white hover:bg-[#7E69AB]">
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
