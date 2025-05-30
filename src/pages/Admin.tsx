
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Settings, BarChart3, ShoppingBag, Megaphone, BookOpen, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminMissions from "@/components/admin/AdminMissions";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto mb-6"></div>
          <p className="text-white font-semibold text-lg">Vérification des permissions...</p>
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
      component: AdminDashboard,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "users",
      label: "Utilisateurs",
      icon: Users,
      component: () => <AdminUsers isOwner={profile?.is_owner || false} />,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "missions",
      label: "Missions",
      icon: Shield,
      component: AdminMissions,
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: "shop",
      label: "Boutique",
      icon: ShoppingBag,
      component: AdminShop,
      color: "from-orange-500 to-red-500"
    },
    {
      id: "bradcoins",
      label: "BradCoins",
      icon: Coins,
      component: AdminBradCoins,
      color: "from-yellow-500 to-amber-500"
    },
    {
      id: "subscriptions",
      label: "Abonnements",
      icon: Settings,
      component: AdminSubscriptions,
      color: "from-pink-500 to-rose-500"
    },
    {
      id: "advertisements",
      label: "Publicités",
      icon: Megaphone,
      component: AdminAdvertisements,
      color: "from-teal-500 to-cyan-500"
    },
    {
      id: "blog",
      label: "Blog",
      icon: BookOpen,
      component: AdminBlog,
      color: "from-violet-500 to-purple-500"
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <Sidebar className="border-r-0 bg-white/10 backdrop-blur-xl shadow-2xl">
          <SidebarHeader className="border-b border-white/20 p-6 bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Administration
                </h2>
                {profile?.is_owner && (
                  <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full font-bold shadow-lg">
                    👑 Propriétaire
                  </span>
                )}
              </div>
            </div>
            <p className="text-white/80 mt-2 text-sm font-medium">
              Panneau de contrôle Qwestoria
            </p>
          </SidebarHeader>
          <SidebarContent className="bg-transparent">
            <SidebarMenu className="p-4 space-y-2">
              {tabs.map((tab) => (
                <SidebarMenuItem key={tab.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(tab.id)}
                    isActive={activeTab === tab.id}
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 backdrop-blur-sm ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl scale-105 border border-white/20`
                        : "text-white/90 hover:bg-white/10 hover:text-white hover:scale-102 border border-transparent"
                    }`}
                  >
                    <tab.icon className="h-6 w-6" />
                    <span className="font-semibold text-sm">{tab.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-20 shrink-0 items-center gap-4 border-b border-white/20 px-8 bg-white/10 backdrop-blur-xl shadow-lg">
            <SidebarTrigger className="-ml-1 text-white hover:text-white/80 hover:bg-white/10 rounded-xl p-2" />
            <div className="ml-auto flex items-center gap-4">
              <div className="text-right">
                <h1 className="text-2xl font-bold text-white">
                  {activeTabData?.label}
                </h1>
                <p className="text-sm text-white/70">
                  Gestion et administration avancée
                </p>
              </div>
              {activeTabData && (
                <div className={`p-3 bg-gradient-to-r ${activeTabData.color} rounded-2xl shadow-xl`}>
                  <activeTabData.icon className="h-7 w-7 text-white" />
                </div>
              )}
            </div>
          </header>

          <main className="flex-1 p-8">
            <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 rounded-3xl overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${activeTabData?.color || 'from-blue-500 to-purple-500'} border-b-0 p-8`}>
                <CardTitle className="flex items-center gap-4 text-3xl font-bold text-white">
                  {activeTabData && (
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <activeTabData.icon className="h-8 w-8 text-white" />
                    </div>
                  )}
                  {activeTabData?.label}
                </CardTitle>
                <CardDescription className="text-white/90 text-lg font-medium">
                  Interface de gestion pour {activeTabData?.label.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 bg-white">
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
