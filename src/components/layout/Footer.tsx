
import { Link } from "react-router-dom";
import { Instagram, Twitch, ExternalLink, Facebook, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import BradHubLogo from "../BradHubLogo";

const Footer = () => {
  const socialLinks = [
    { 
      name: "TikTok", 
      url: "https://www.tiktok.com/@bradcon_tv",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
    },
    { 
      name: "Twitch", 
      url: "https://www.twitch.tv/bradcon91",
      icon: <Twitch className="h-4 w-4" />
    },
    { 
      name: "Snapchat", 
      url: "https://www.snapchat.com/add/bradcontv",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c-1 0-2.4 1-2.7 3.5-.1.3-.3.4-.6.5-.8.2-2.2.8-2.2 2s1.6 2.1 2 2.5l.5.5c0 .3-.2.4-.5.6-.4.4-1 1-1 1.8 0 .7.3 1.8 3 2.5a.5.5 0 0 1 .4.5 1 1 0 0 0 .9.7c.6 0 1.2-.4 2.2-.4s1.6.4 2.2.4c.5 0 .8-.3.9-.7a.5.5 0 0 1 .4-.5c2.7-.7 3-1.8 3-2.5 0-.8-.6-1.4-1-1.8-.3-.2-.5-.3-.5-.6l.5-.5c.4-.4 2-1.2 2-2.5s-1.4-1.8-2.2-2c-.3-.1-.5-.2-.6-.5C14.4 3 13 2 12 2Z"></path></svg>
    },
    { 
      name: "Instagram", 
      url: "https://www.instagram.com/eymeric.alt/",
      icon: <Instagram className="h-4 w-4" />
    },
    { 
      name: "Twitter", 
      url: "https://twitter.com/bradcon_tv",
      icon: <Twitter className="h-4 w-4" />
    },
    { 
      name: "Facebook", 
      url: "https://facebook.com/bradcontv",
      icon: <Facebook className="h-4 w-4" />
    },
  ];

  const footerLinks = [
    { name: "Accueil", path: "/" },
    { name: "Missions", path: "/missions" },
    { name: "Boutique", path: "/shop" },
    { name: "Classement", path: "/leaderboard" },
    { name: "Coéquipiers", path: "/teammates" },
    { name: "Blog", path: "/blog" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <footer className="bg-gradient-to-br from-white via-gray-50 to-purple-50/30 dark:from-[#1A1F2C] dark:via-[#1E2332] dark:to-[#2A243C] py-12 border-t border-gray-200/60 dark:border-gray-700/50 text-gray-600 dark:text-gray-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/20 to-transparent dark:from-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-200/20 to-transparent dark:from-amber-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-8">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center mb-4">
              <BradHubLogo size="md" />
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">BradFlow</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">La communauté Fortnite</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed">
              Rejoignez des milliers de joueurs passionnés et découvrez une nouvelle façon de vivre Fortnite.
            </p>
          </div>

          {/* Quick links */}
          <div className="text-center lg:text-left">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Navigation</h4>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 py-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Social Icons */}
          <div className="text-center lg:text-left">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Suivez-nous</h4>
            <div className="flex justify-center lg:justify-start space-x-3 mb-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 border border-gray-200/50 dark:border-gray-700/50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Restez connectés pour toutes les actualités !
            </p>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200/60 dark:border-gray-700/50 flex flex-col md:flex-row items-center justify-between text-sm">
          <p className="text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} BradFlow. Tous droits réservés.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
              Confidentialité
            </Link>
            <Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
              Conditions
            </Link>
            <Link to="/cookies" className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
