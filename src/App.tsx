
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Referral from "@/pages/Referral";
import NotFound from "@/pages/NotFound";
import "./App.css";
import "./styles/mobile-fix.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <div className="app-root">
              <Routes>
                {/* Landing page without layout - Index manages its own Layout */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* All other pages with layout */}
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/missions" element={<Layout><Missions /></Layout>} />
                <Route path="/missions/:id" element={<Layout><MissionDetail /></Layout>} />
                <Route path="/messages" element={<Layout><Messages /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/shop" element={<Layout><Shop /></Layout>} />
                <Route path="/admin" element={<Layout><Admin /></Layout>} />
                <Route path="/fortnite-shop" element={<Layout><FortniteShop /></Layout>} />
                <Route path="/blog" element={<Layout><Blog /></Layout>} />
                <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
                <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />
                <Route path="/teammates" element={<Layout><Teammates /></Layout>} />
                <Route path="/referral" element={<Layout><Referral /></Layout>} />
                <Route path="*" element={<Layout><NotFound /></Layout>} />
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
