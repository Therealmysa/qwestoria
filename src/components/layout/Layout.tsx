
import { ReactNode } from "react";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gradient-to-br dark:from-[#1A1F2C] dark:to-[#2A243C]">
      <MainNavigation />
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 w-full"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
