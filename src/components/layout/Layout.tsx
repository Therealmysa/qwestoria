
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
      {/* Light mode background decoration - fixed positioning to avoid scroll interference */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-40 h-40 bg-blue-100/30 rounded-full blur-2xl animate-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
        <div className="absolute w-32 h-32 bg-cyan-100/30 rounded-full blur-2xl animate-float" style={{ top: '60%', right: '10%', animationDelay: '3s' }}></div>
        <div className="absolute w-48 h-48 bg-blue-50/50 rounded-full blur-2xl animate-float" style={{ bottom: '15%', left: '15%', animationDelay: '6s' }}></div>
        <div className="absolute w-24 h-24 bg-cyan-50/40 rounded-full blur-2xl animate-float" style={{ top: '30%', right: '25%', animationDelay: '2s' }}></div>
        <div className="absolute w-36 h-36 bg-blue-100/20 rounded-full blur-2xl animate-float" style={{ bottom: '40%', right: '5%', animationDelay: '4s' }}></div>
      </div>

      {/* Main content - remove all potential scroll blocking */}
      <div className="relative z-10">
        <MainNavigation />
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'auto',
            touchAction: 'auto'
          }}
        >
          {children}
        </motion.main>
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;
