
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Settings, BarChart3, ShoppingBag, Megaphone, BookOpen } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Vérification des permissions...</p>
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Sidebar className="border-r border-slate-200 bg-white shadow-lg">
          <SidebarHeader className="border-b border-slate-200 p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">
                Administration
              </h2>
              {profile?.is_owner && (
                <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-semibold">
                  Propriétaire
                </span>
              )}
            </div>
            <p className="text-blue-100 mt-2 text-sm">
              Panneau de contrôle Qwestoria
            </p>
          </SidebarHeader>
          <SidebarContent className="bg-white">
            <SidebarMenu className="p-3 space-y-1">
              {tabs.map((tab) => (
                <SidebarMenuItem key={tab.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(tab.id)}
                    isActive={activeTab === tab.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-6 bg-white shadow-sm">
            <SidebarTrigger className="-ml-1 text-gray-600 hover:text-blue-600" />
            <div className="ml-auto flex items-center gap-3">
              <div className="text-right">
                <h1 className="text-xl font-bold text-gray-800">
                  {activeTabData?.label}
                </h1>
                <p className="text-sm text-gray-500">
                  Gestion et administration
                </p>
              </div>
              {activeTabData && (
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <activeTabData.icon className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          </header>

          <main className="flex-1 p-6">
            <Card className="bg-white shadow-xl border border-slate-200 rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 p-6">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                  {activeTabData && <activeTabData.icon className="h-6 w-6 text-blue-600" />}
                  {activeTabData?.label}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Gestion et administration {activeTabData?.label.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-white">
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
