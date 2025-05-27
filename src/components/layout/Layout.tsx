
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const hideFooter = location.pathname === "/messages";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 bg-particles">
      {/* Professional floating background particles for dark mode */}
      <div className="hidden dark:block fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-40 h-40 bg-slate-500/8 rounded-full blur-2xl animate-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
        <div className="absolute w-32 h-32 bg-gray-500/8 rounded-full blur-2xl animate-float" style={{ top: '60%', right: '10%', animationDelay: '3s' }}></div>
        <div className="absolute w-48 h-48 bg-slate-500/6 rounded-full blur-2xl animate-float" style={{ bottom: '15%', left: '15%', animationDelay: '6s' }}></div>
        <div className="absolute w-24 h-24 bg-gray-600/10 rounded-full blur-2xl animate-float" style={{ top: '30%', right: '25%', animationDelay: '2s' }}></div>
        <div className="absolute w-36 h-36 bg-slate-600/6 rounded-full blur-2xl animate-float" style={{ bottom: '40%', right: '5%', animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        <MainNavigation />
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 w-full"
        >
          {children}
        </motion.main>
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;
