
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Settings, BarChart3, ShoppingBag, Megaphone, BookOpen, CheckSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminMissions from "@/components/admin/AdminMissions";
import AdminMissionSubmissions from "@/components/admin/AdminMissionSubmissions";
import AdminShop from "@/components/admin/AdminShop";
import AdminSubscriptions from "@/components/admin/AdminSubscriptions";
import AdminAdvertisements from "@/components/admin/AdminAdvertisements";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminBradCoins from "@/components/admin/AdminBradCoins";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Vérifier si l'utilisateur est admin ou propriétaire
  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin, is_owner')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!user || (!profile?.is_admin && !profile?.is_owner)) {
    return <Navigate to="/dashboard" replace />;
  }

  const tabs = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: BarChart3,
      component: AdminDashboard
    },
    {
      id: "users",
      label: "Utilisateurs",
      icon: Users,
      component: () => <AdminUsers isOwner={profile?.is_owner || false} />
    },
    {
      id: "missions",
      label: "Missions",
      icon: Shield,
      component: AdminMissions
    },
    {
      id: "mission-submissions",
      label: "Validation Missions",
      icon: CheckSquare,
      component: AdminMissionSubmissions
    },
    {
      id: "shop",
      label: "Boutique",
      icon: ShoppingBag,
      component: AdminShop
    },
    {
      id: "bradcoins",
      label: "BradCoins",
      icon: Settings,
      component: AdminBradCoins
    },
    {
      id: "subscriptions",
      label: "Abonnements",
      icon: Settings,
      component: AdminSubscriptions
    },
    {
      id: "advertisements",
      label: "Publicités",
      icon: Megaphone,
      component: AdminAdvertisements
    },
    {
      id: "blog",
      label: "Blog",
      icon: BookOpen,
      component: AdminBlog
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-gray-900">
        <Sidebar className="border-r border-gray-200 dark:border-slate-700">
          <SidebarHeader className="border-b border-gray-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base lg:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 dark:from-white dark:via-[#f1c40f] dark:to-[#9b87f5]">
                Administration
              </h2>
              {profile?.is_owner && (
                <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
                  Propriétaire
                </span>
              )}
            </div>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 mt-1">
              Panneau de contrôle Qwestoria
            </p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="p-2">
              {tabs.map((tab) => (
                <SidebarMenuItem key={tab.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(tab.id)}
                    isActive={activeTab === tab.id}
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-slate-700 text-sm"
                  >
                    <tab.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-14 lg:h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-slate-700 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto">
              <h1 className="text-lg lg:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 dark:from-white dark:via-[#f1c40f] dark:to-[#9b87f5]">
                {activeTabData?.label}
              </h1>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-6">
            <Card className="dark:bg-slate-800/15 dark:backdrop-blur-xl dark:border dark:border-slate-600/15 bg-white/90 backdrop-blur-md shadow-2xl dark:shadow-slate-500/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg lg:text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 dark:from-white dark:via-[#f1c40f] dark:to-[#9b87f5]">
                  {activeTabData && <activeTabData.icon className="h-5 w-5 flex-shrink-0" />}
                  <span className="truncate">{activeTabData?.label}</span>
                </CardTitle>
                <CardDescription className="dark:text-gray-300 text-sm">
                  Gestion et administration {activeTabData?.label.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTabData && <activeTabData.component />}
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
