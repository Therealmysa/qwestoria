
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log("Tentative de déconnexion");
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error(
        error.message || "Une erreur est survenue lors de la déconnexion"
      );
    }
  };

  // Débogage de l'état d'authentification
  useEffect(() => {
    console.log("État d'authentification dans Navbar:", { user, loading });
  }, [user, loading]);

  return (
    <nav className="sticky top-0 z-50 bg-[#1A1F2C] px-4 py-3 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-[#9b87f5]">BradFlow</span>
        </Link>

        <div className="hidden space-x-4 md:flex">
          <Link to="/" className="text-gray-200 hover:text-[#9b87f5]">
            Accueil
          </Link>
          <Link to="/missions" className="text-gray-200 hover:text-[#9b87f5]">
            Missions
          </Link>
          <Link to="/shop" className="text-gray-200 hover:text-[#9b87f5]">
            Boutique
          </Link>
          <Link
            to="/leaderboard"
            className="text-gray-200 hover:text-[#9b87f5]"
          >
            Classement
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          {!loading &&
            (user ? (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-[#9b87f5] hover:bg-[#9b87f5]/20"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-red-500/20 hover:text-red-300"
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
              </div>
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
