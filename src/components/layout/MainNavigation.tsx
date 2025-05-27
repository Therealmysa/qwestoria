import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useTheme } from "@/components/theme/theme-provider";
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
import {
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
  MessageSquare,
  BookOpen,
  Shield,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

const MainNavigation = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme } = useTheme();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchProfile(session.user.id), 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

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
    { name: "Blog", path: "/blog" },
    { name: "Messagerie", path: "/messages" },
    { name: "Boutique", path: "/shop" },
    { name: "Team Mates", path: "/teammates" },
  ];

  // Mobile drawer menu component
  const MobileMenu = () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-700 dark:text-gray-200 hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-500/20 dark:hover:text-slate-300 rounded-full"
        >
          <Menu />
          <span className="sr-only">Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 border-t border-slate-400/20">
        <div className="flex justify-between items-center px-4 pt-4 border-b border-gray-200 dark:border-slate-400/20 pb-3">
          <div className="flex items-center">
            <BradHubLogo size="md" />
          </div>
          <DrawerClose asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-700 dark:text-gray-200 rounded-full"
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
                        ? "bg-primary/10 text-primary dark:bg-slate-500/20 dark:text-slate-300"
                        : "text-gray-700 hover:bg-primary/10 hover:text-primary dark:text-gray-200 dark:hover:bg-slate-500/10 dark:hover:text-slate-300"
                    )}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              </DrawerClose>
            ))}
            <DrawerClose asChild>
              <Link to="/shop">
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "px-4 py-3 rounded-md transition-all",
                    location.pathname === "/shop"
                      ? "bg-primary/10 text-primary dark:bg-slate-500/20 dark:text-slate-300"
                      : "text-gray-700 hover:bg-primary/10 hover:text-primary dark:text-gray-200 dark:hover:bg-slate-500/10 dark:hover:text-slate-300"
                  )}
                >
                  Boutique
                </motion.div>
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link to="/leaderboard">
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "px-4 py-3 rounded-md transition-all",
                    location.pathname === "/leaderboard"
                      ? "bg-primary/10 text-primary dark:bg-slate-500/20 dark:text-slate-300"
                      : "text-gray-700 hover:bg-primary/10 hover:text-primary dark:text-gray-200 dark:hover:bg-slate-500/10 dark:hover:text-slate-300"
                  )}
                >
                  Classement
                </motion.div>
              </Link>
            </DrawerClose>
            
            {/* Theme options in mobile menu */}
            <div className="border-t border-gray-200 dark:border-slate-400/20 pt-2 mt-2">
              <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Thème
              </div>
              <DrawerClose asChild>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme("light")}
                  className="w-full text-left px-4 py-3 rounded-md transition-all text-gray-700 hover:bg-primary/10 hover:text-primary dark:text-gray-200 dark:hover:bg-slate-500/10 dark:hover:text-slate-300 flex items-center"
                >
                  <Sun className="h-4 w-4 mr-3 text-amber-500" />
                  Clair
                </motion.button>
              </DrawerClose>
              <DrawerClose asChild>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme("dark")}
                  className="w-full text-left px-4 py-3 rounded-md transition-all text-gray-700 hover:bg-primary/10 hover:text-primary dark:text-gray-200 dark:hover:bg-slate-500/10 dark:hover:text-slate-300 flex items-center"
                >
                  <Moon className="h-4 w-4 mr-3 text-slate-400" />
                  Sombre
                </motion.button>
              </DrawerClose>
              <DrawerClose asChild>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme("system")}
                  className="w-full text-left px-4 py-3 rounded-md transition-all text-gray-700 hover:bg-primary/10 hover:text-primary dark:text-gray-200 dark:hover:bg-slate-500/10 dark:hover:text-slate-300 flex items-center"
                >
                  <Monitor className="h-4 w-4 mr-3 text-gray-500" />
                  Système
                </motion.button>
              </DrawerClose>
            </div>
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 backdrop-blur-lg bg-opacity-90 px-4 py-3 shadow-lg border-b border-gray-200 dark:border-gray-800">
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
                          "px-3 py-2 text-sm rounded-full transition-colors hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-500/20 dark:hover:text-slate-300",
                          location.pathname === item.path
                            ? "bg-primary/10 text-primary font-medium dark:bg-slate-500/20 dark:text-slate-300"
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
                    className="px-3 py-2 text-sm rounded-full text-gray-700 hover:bg-primary/10 hover:text-primary 
                             data-[state=open]:bg-primary/10 data-[state=open]:text-primary 
                             dark:text-gray-200 dark:hover:bg-slate-500/20 dark:hover:text-slate-300 
                             dark:data-[state=open]:bg-slate-500/20 dark:data-[state=open]:text-slate-300"
                  >
                    Plus
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[240px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-400/20 rounded-lg">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/fortnite-shop"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary text-gray-700 dark:hover:bg-slate-500/10 dark:hover:text-slate-300 dark:text-gray-200"
                          >
                            <div className="text-sm font-medium flex items-center">
                              <BookOpen className="mr-2 h-4 w-4" />
                              Boutique Fortnite
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Accédez à la boutique Fortnite du jour!
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/leaderboard"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary text-gray-700 dark:hover:bg-slate-500/10 dark:hover:text-slate-300 dark:text-gray-200"
                          >
                            <div className="text-sm font-medium flex items-center">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Classement
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Top joueurs de la communauté
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li className="border-t border-gray-200 dark:border-slate-400/20 pt-2">
                        <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                          Thème
                        </div>
                        <button
                          onClick={() => setTheme("light")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary text-gray-700 dark:hover:bg-slate-500/10 dark:hover:text-slate-300 dark:text-gray-200"
                        >
                          <div className="text-sm flex items-center">
                            <Sun className="mr-2 h-4 w-4 text-amber-500" />
                            Clair
                          </div>
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary text-gray-700 dark:hover:bg-slate-500/10 dark:hover:text-slate-300 dark:text-gray-200"
                        >
                          <div className="text-sm flex items-center">
                            <Moon className="mr-2 h-4 w-4 text-slate-400" />
                            Sombre
                          </div>
                        </button>
                        <button
                          onClick={() => setTheme("system")}
                          className="w-full text-left block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/10 hover:text-primary text-gray-700 dark:hover:bg-slate-500/10 dark:hover:text-slate-300 dark:text-gray-200"
                        >
                          <div className="text-sm flex items-center">
                            <Monitor className="mr-2 h-4 w-4 text-gray-500" />
                            Système
                          </div>
                        </button>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Controls - always on the far right */}
          {!loading &&
            (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/30 text-gray-700 dark:text-white hover:from-primary/20 hover:to-primary/40 dark:hover:from-slate-500/20 dark:hover:to-slate-500/40 transition-all duration-300"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={profile?.avatar_url} alt={profile?.username} />
                      <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 dark:from-slate-500 dark:to-slate-600 text-white text-xs">
                        {profile?.username?.charAt(0)?.toUpperCase() || <UserIcon className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{profile?.username || "Mon compte"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white dark:bg-slate-800 text-gray-700 dark:text-white border-gray-200 dark:border-slate-400/20"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{profile?.username || "Mon compte"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-400/20" />
                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-500/20 dark:hover:text-slate-300 cursor-pointer"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  {(profile?.is_admin || profile?.is_owner) && (
                    <DropdownMenuItem
                      className="hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-500/20 dark:hover:text-slate-300 cursor-pointer"
                      onClick={() => navigate("/admin")}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Panel Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-500/20 dark:hover:text-slate-300 cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-slate-400/20" />
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
                <Button className="bg-primary hover:bg-primary/90 dark:bg-gradient-to-r dark:from-slate-500 dark:to-slate-600 dark:hover:opacity-90 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-full">
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
