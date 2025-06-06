
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useUserStatus } from "@/hooks/useUserStatus";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  User, 
  Settings, 
  Trophy, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  BookOpen,
  Menu,
  X,
  Shield,
  Star,
  Crown,
  UserPlus
} from "lucide-react";

const MainNavigation = () => {
  const { user, signOut } = useAuth();
  const { isVip, isAdmin, isOwner, isPremium } = useUserStatus();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Accueil", href: "/dashboard", icon: Home },
    { name: "Missions", href: "/missions", icon: Trophy },
    { name: "Boutique", href: "/shop", icon: ShoppingBag },
    { name: "Équipiers", href: "/teammates", icon: Users },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Classement", href: "/leaderboard", icon: Trophy },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Parrainage", href: "/referral", icon: UserPlus }, // Nouvelle entrée
  ];

  // Ajouter le lien admin si l'utilisateur est admin ou owner
  if (isAdmin || isOwner) {
    navigationItems.push({ name: "Admin", href: "/admin", icon: Shield });
  }

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  const getUserBadges = () => {
    const badges = [];
    if (isOwner) badges.push({ text: "Owner", color: "bg-red-500", icon: Crown });
    if (isAdmin) badges.push({ text: "Admin", color: "bg-blue-500", icon: Shield });
    if (isPremium) badges.push({ text: "Premium", color: "bg-purple-500", icon: Star });
    if (isVip) badges.push({ text: "VIP", color: "bg-yellow-500", icon: Star });
    return badges;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo et navigation principale */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Qwestoria</span>
            </Link>

            {/* Navigation desktop */}
            <div className="hidden md:flex ml-10 space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActiveRoute(item.href)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Menu utilisateur */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Badges utilisateur */}
                <div className="hidden sm:flex items-center space-x-1">
                  {getUserBadges().map((badge, index) => {
                    const BadgeIcon = badge.icon;
                    return (
                      <Badge key={index} className={`${badge.color} text-white text-xs`}>
                        <BadgeIcon className="h-3 w-3 mr-1" />
                        {badge.text}
                      </Badge>
                    );
                  })}
                </div>

                {/* Menu desktop */}
                <div className="hidden md:flex items-center space-x-3">
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profil</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    Déconnexion
                  </Button>
                </div>

                {/* Bouton menu mobile */}
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Connexion</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">S'inscrire</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && user && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActiveRoute(item.href)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600"
                >
                  <User className="h-4 w-4 mr-3" />
                  Profil
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 w-full text-left"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Déconnexion
                </button>
              </div>

              {/* Badges mobile */}
              <div className="flex flex-wrap gap-1 px-3 pt-2">
                {getUserBadges().map((badge, index) => {
                  const BadgeIcon = badge.icon;
                  return (
                    <Badge key={index} className={`${badge.color} text-white text-xs`}>
                      <BadgeIcon className="h-3 w-3 mr-1" />
                      {badge.text}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavigation;
