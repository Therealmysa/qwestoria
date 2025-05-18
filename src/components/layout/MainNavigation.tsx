
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BradHubLogo from "../BradHubLogo";
import { cn } from "@/lib/utils";
import { Menu, ChevronDown, User as UserIcon, LogOut } from "lucide-react";

const MainNavigation = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue lors de la déconnexion");
    }
  };

  const menuItems = [
    { name: "Accueil", path: "/" },
    { name: "Missions", path: "/missions" },
    { name: "Boutique", path: "/shop" },
    { name: "Classement", path: "/leaderboard" },
    { name: "Coéquipiers", path: "/teammates" }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#1A1F2C] to-[#2A243C] backdrop-blur-lg bg-opacity-80 px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <BradHubLogo size="md" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1">
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link to={item.path}>
                    <NavigationMenuLink
                      className={cn(
                        "px-3 py-2 text-sm rounded-full transition-colors hover:bg-[#9b87f5]/20 hover:text-[#9b87f5]",
                        location.pathname === item.path ? "bg-[#9b87f5]/20 text-[#9b87f5] font-medium" : "text-gray-200"
                      )}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-3 py-2 text-sm rounded-full hover:bg-[#9b87f5]/20 hover:text-[#9b87f5] data-[state=open]:bg-[#9b87f5]/20 data-[state=open]:text-[#9b87f5] text-gray-200">
                  Plus
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4 md:w-[240px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/blog"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#9b87f5]/10 hover:text-[#9b87f5]"
                        >
                          <div className="text-sm font-medium">Blog</div>
                          <p className="text-xs text-gray-400">
                            Actualités et mises à jour Fortnite
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/about"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#9b87f5]/10 hover:text-[#9b87f5]"
                        >
                          <div className="text-sm font-medium">À propos</div>
                          <p className="text-xs text-gray-400">
                            En savoir plus sur BradHub
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost" 
            size="icon"
            className="md:hidden text-gray-200 hover:bg-[#9b87f5]/20 hover:text-[#9b87f5]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu />
            <span className="sr-only">Toggle menu</span>
          </Button>

          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="rounded-full flex items-center gap-2 bg-gradient-to-r from-[#9b87f5]/10 to-[#FFD700]/10 text-white hover:from-[#9b87f5]/20 hover:to-[#FFD700]/20 transition-all duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#FFD700] flex items-center justify-center text-white">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:inline">Mon compte</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#221F26] text-white border-[#9b87f5]/20">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Mon compte</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#9b87f5]/20" />
                  <DropdownMenuItem 
                    className="hover:bg-[#9b87f5]/20 hover:text-[#9b87f5] cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-[#9b87f5]/20 hover:text-[#9b87f5] cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#9b87f5]/20" />
                  <DropdownMenuItem 
                    className="text-red-400 hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-[#9b87f5] to-[#FFD700] hover:from-[#8976e4] hover:to-[#e6c300] text-white shadow-md hover:shadow-lg transition-all duration-300">
                  Connexion
                </Button>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-2 rounded-lg bg-[#221F26] shadow-lg overflow-hidden"
          >
            <div className="flex flex-col p-2">
              {menuItems.map((item) => (
                <Link key={item.name} to={item.path}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={cn(
                      "px-4 py-3 rounded-md transition-all",
                      location.pathname === item.path
                        ? "bg-[#9b87f5]/20 text-[#9b87f5]"
                        : "text-gray-200 hover:bg-[#9b87f5]/10 hover:text-[#9b87f5]"
                    )}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
              <Link to="/blog">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="px-4 py-3 rounded-md text-gray-200 hover:bg-[#9b87f5]/10 hover:text-[#9b87f5] transition-all"
                >
                  Blog
                </motion.div>
              </Link>
              <Link to="/about">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="px-4 py-3 rounded-md text-gray-200 hover:bg-[#9b87f5]/10 hover:text-[#9b87f5] transition-all"
                >
                  À propos
                </motion.div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MainNavigation;
