
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Settings, BarChart3, ShoppingBag, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminMissions from "@/components/admin/AdminMissions";
import AdminShop from "@/components/admin/AdminShop";
import AdminSubscriptions from "@/components/admin/AdminSubscriptions";
import AdminAdvertisements from "@/components/admin/AdminAdvertisements";

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur est admin ou propriétaire
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Administration BradHub
            {profile?.is_owner && (
              <span className="ml-3 text-sm bg-yellow-500 text-white px-3 py-1 rounded-full">
                Propriétaire
              </span>
            )}
          </h1>
          <p className="text-gray-600">
            Panneau de contrôle pour la gestion de la plateforme
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 text-sm"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </CardTitle>
                  <CardDescription>
                    Gestion et administration {tab.label.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <tab.component />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
