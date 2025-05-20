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
import { ThemeToggle } from "../theme/theme-toggle";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown, User as UserIcon, LogOut } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

const MainNavigation = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      toast.error(
        error.message || "Une erreur est survenue lors de la déconnexion"
      );
    }
  };

  const menuItems = [
    { name: "Accueil", path: "/" },
    { name: "Missions", path: "/missions" },
    { name: "Boutique", path: "/shop" },
    { name: "Classement", path: "/leaderboard" },
    { name: "Coéquipiers", path: "/teammates" },
  ];

  // Mobile drawer menu component
  const MobileMenu = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-200 hover:bg-[#9b87f5]/20 hover:text-[#9b87f5]"
        >
          <Menu />
          <span className="sr-only">Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white dark:bg-gradient-to-r dark:from-[#1A1F2C] dark:to-[#2A243C] border-t border-purple-400/20">
        <div className="flex justify-between items-center px-4 pt-4 border-b border-purple-400/20 pb-3">
          <BradHubLogo size="sm" />
          <div className="text-lg font-semibold ml-2 text-gradient">
            BradFlow
          </div>
          <DrawerClose asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-700 dark:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </div>
        <div className="px-4 pb-6 pt-2">
          <nav className="flex flex-col space-y-1">
            {menuItems.map((item) => (
              <DrawerClose key={item.name} asChild>
                <Link to={item.path}>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "px-4 py-3 rounded-md transition-all",
                      location.pathname === item.path
                        ? "bg-purple-500/20 text-purple-600 dark:text-[#9b87f5]"
                        : "text-gray-700 hover:bg-purple-500/10 hover:text-purple-600 dark:text-gray-200 dark:hover:bg-[#9b87f5]/10 dark:hover:text-[#9b87f5]"
                    )}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              </DrawerClose>
            ))}
            <DrawerClose asChild>
              <Link to="/blog">
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-3 rounded-md text-gray-700 hover:bg-purple-500/10 hover:text-purple-600 dark:text-gray-200 dark:hover:bg-[#9b87f5]/10 dark:hover:text-[#9b87f5] transition-all"
                >
                  Blog
                </motion.div>
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link to="/about">
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-3 rounded-md text-gray-700 hover:bg-purple-500/10 hover:text-purple-600 dark:text-gray-200 dark:hover:bg-[#9b87f5]/10 dark:hover:text-[#9b87f5] transition-all"
                >
                  À propos
                </motion.div>
              </Link>
            </DrawerClose>
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gradient-to-r dark:from-[#1A1F2C] dark:to-[#2A243C] backdrop-blur-lg bg-opacity-80 px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <BradHubLogo size="md" />
        </div>

        {/* Right side with menu and auth controls */}
        <div className="flex items-center space-x-4">
          {/* Desktop Navigation - positioned on the right before auth controls */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link to={item.path}>
                      <NavigationMenuLink
                        className={cn(
                          "px-3 py-2 text-sm rounded-full transition-colors hover:bg-purple-500/10 hover:text-purple-600 dark:hover:bg-[#9b87f5]/20 dark:hover:text-[#9b87f5]",
                          location.pathname === item.path
                            ? "bg-purple-500/10 text-purple-600 font-medium dark:bg-[#9b87f5]/20 dark:text-[#9b87f5]"
                            : "text-gray-700 dark:text-gray-200"
                        )}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="px-3 py-2 text-sm rounded-full text-gray-700 hover:bg-purple-500/10 hover:text-purple-600 
                             data-[state=open]:bg-purple-500/10 data-[state=open]:text-purple-600 
                             dark:text-gray-200 dark:hover:bg-[#9b87f5]/20 dark:hover:text-[#9b87f5] 
                             dark:data-[state=open]:bg-[#9b87f5]/20 dark:data-[state=open]:text-[#9b87f5]"
                  >
                    Plus
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4 md:w-[240px] bg-white dark:bg-[#221F26] border border-purple-400/20">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/blog"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-500/10 hover:text-purple-600 text-gray-700 dark:hover:bg-[#9b87f5]/10 dark:hover:text-[#9b87f5] dark:text-gray-200"
                          >
                            <div className="text-sm font-medium">Blog</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Actualités et mises à jour Fortnite
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/about"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-500/10 hover:text-purple-600 text-gray-700 dark:hover:bg-[#9b87f5]/10 dark:hover:text-[#9b87f5] dark:text-gray-200"
                          >
                            <div className="text-sm font-medium">À propos</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
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

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Auth Controls - always on the far right */}
          {!loading &&
            (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-purple-500/30 text-gray-700 dark:text-white hover:from-purple-500/20 hover:to-purple-500/40 dark:hover:from-[#9b87f5]/20 dark:hover:to-[#9b87f5]/40 transition-all duration-300"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 dark:from-[#9b87f5] dark:to-[#7654d3] flex items-center justify-center text-white">
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:inline">Mon compte</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white dark:bg-[#221F26] text-gray-700 dark:text-white border-purple-400/20"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">Mon compte</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-purple-400/20" />
                  <DropdownMenuItem
                    className="hover:bg-purple-500/10 hover:text-purple-600 dark:hover:bg-[#9b87f5]/20 dark:hover:text-[#9b87f5] cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-purple-500/10 hover:text-purple-600 dark:hover:bg-[#9b87f5]/20 dark:hover:text-[#9b87f5] cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-purple-400/20" />
                  <DropdownMenuItem
                    className="text-red-500 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/20 dark:hover:text-red-300 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 dark:from-[#9b87f5] dark:to-[#7654d3] dark:hover:from-[#8976e4] dark:hover:to-[#6443c2] text-white shadow-md hover:shadow-lg transition-all duration-300">
                  Connexion
                </Button>
              </Link>
            ))}

          {/* Mobile Menu Trigger - moved to be the last element */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
