
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Missions from "@/pages/Missions";
import MissionDetail from "@/pages/MissionDetail";
import Shop from "@/pages/Shop";
import Messages from "@/pages/Messages";
import Teammates from "@/pages/Teammates";
import Leaderboard from "@/pages/Leaderboard";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Admin from "@/pages/Admin";
import FortniteShop from "@/pages/FortniteShop";
import Referral from "@/pages/Referral";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/missions" element={<Missions />} />
                  <Route path="/missions/:id" element={<MissionDetail />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/teammates" element={<Teammates />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/fortnite-shop" element={<FortniteShop />} />
                  <Route path="/referral" element={<Referral />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Layout>
              <Toaster />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
