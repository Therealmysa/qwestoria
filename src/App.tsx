
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Missions from "@/pages/Missions";
import MissionDetail from "@/pages/MissionDetail";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import Shop from "@/pages/Shop";
import Admin from "@/pages/Admin";
import FortniteShop from "@/pages/FortniteShop";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Leaderboard from "@/pages/Leaderboard";
import Teammates from "@/pages/Teammates";
import NotFound from "@/pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/*" element={
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/missions" element={<Missions />} />
                      <Route path="/missions/:id" element={<MissionDetail />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/fortnite-shop" element={<FortniteShop />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      <Route path="/teammates" element={<Teammates />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                } />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
