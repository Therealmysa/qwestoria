
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Missions from "./pages/Missions";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import FortniteShop from "./pages/FortniteShop";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import Teammates from "./pages/Teammates";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";
import VipUpgrade from "./components/vip/VipUpgrade";

const queryClient = new QueryClient();

const App = () => {
  // Force light mode on app load
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="bradhub-theme">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route
                  path="/auth"
                  element={
                    <Layout>
                      <Auth />
                    </Layout>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <Layout>
                      <Dashboard />
                    </Layout>
                  }
                />
                <Route
                  path="/missions"
                  element={
                    <Layout>
                      <Missions />
                    </Layout>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <Layout>
                      <Shop />
                    </Layout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <Layout>
                      <Profile />
                    </Layout>
                  }
                />
                <Route
                  path="/leaderboard"
                  element={
                    <Layout>
                      <Leaderboard />
                    </Layout>
                  }
                />
                <Route
                  path="/fortnite-shop"
                  element={
                    <Layout>
                      <FortniteShop />
                    </Layout>
                  }
                />
                <Route
                  path="/teammates"
                  element={
                    <Layout>
                      <Teammates />
                    </Layout>
                  }
                />
                <Route
                  path="/blog"
                  element={
                    <Layout>
                      <Blog />
                    </Layout>
                  }
                />
                <Route
                  path="/blog/:id"
                  element={
                    <Layout>
                      <BlogPost />
                    </Layout>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <Layout>
                      <Messages />
                    </Layout>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <Layout>
                      <Admin />
                    </Layout>
                  }
                />
                <Route
                  path="/vip"
                  element={
                    <Layout>
                      <VipUpgrade />
                    </Layout>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route
                  path="*"
                  element={
                    <Layout>
                      <NotFound />
                    </Layout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
