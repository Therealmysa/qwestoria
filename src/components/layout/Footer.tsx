
import { Link } from "react-router-dom";
import { Instagram, Twitch, ExternalLink, Facebook, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import BradHubLogo from "../BradHubLogo";

const Footer = () => {
  const socialLinks = [
    { 
      name: "TikTok", 
      url: "https://www.tiktok.com/@bradcon_tv",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
    },
    { 
      name: "Twitch", 
      url: "https://www.twitch.tv/bradcon91",
      icon: <Twitch className="h-3.5 w-3.5" />
    },
    { 
      name: "Snapchat", 
      url: "https://www.snapchat.com/add/bradcontv",
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c-1 0-2.4 1-2.7 3.5-.1.3-.3.4-.6.5-.8.2-2.2.8-2.2 2s1.6 2.1 2 2.5l.5.5c0 .3-.2.4-.5.6-.4.4-1 1-1 1.8 0 .7.3 1.8 3 2.5a.5.5 0 0 1 .4.5 1 1 0 0 0 .9.7c.6 0 1.2-.4 2.2-.4s1.6.4 2.2.4c.5 0 .8-.3.9-.7a.5.5 0 0 1 .4-.5c2.7-.7 3-1.8 3-2.5 0-.8-.6-1.4-1-1.8-.3-.2-.5-.3-.5-.6l.5-.5c.4-.4 2-1.2 2-2.5s-1.4-1.8-2.2-2c-.3-.1-.5-.2-.6-.5C14.4 3 13 2 12 2Z"></path></svg>
    },
    { 
      name: "Instagram", 
      url: "https://www.instagram.com/eymeric.alt/",
      icon: <Instagram className="h-3.5 w-3.5" />
    },
    { 
      name: "Twitter", 
      url: "https://twitter.com/bradcon_tv",
      icon: <Twitter className="h-3.5 w-3.5" />
    },
    { 
      name: "Facebook", 
      url: "https://facebook.com/bradcontv",
      icon: <Facebook className="h-3.5 w-3.5" />
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
    <footer className="bg-white/95 dark:bg-[#1A1F2C]/95 backdrop-blur-sm py-6 border-t border-gray-200/60 dark:border-gray-700/50 text-gray-600 dark:text-gray-300">
      <div className="container mx-auto px-6">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Logo and tagline - compact */}
          <div className="flex items-center justify-center md:justify-start">
            <BradHubLogo size="sm" />
            <div className="ml-3">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">BradFlow</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">La communauté Fortnite</p>
            </div>
          </div>

          {/* Quick links - compact grid */}
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {footerLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Social Icons - compact */}
          <div className="flex justify-center md:justify-end items-center">
            <div className="flex space-x-2">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={link.name}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom section - more compact */}
        <div className="pt-3 border-t border-gray-200/40 dark:border-gray-700/40 flex flex-col sm:flex-row items-center justify-between text-xs">
          <p className="text-gray-400 dark:text-gray-500 mb-2 sm:mb-0">
            &copy; {new Date().getFullYear()} BradFlow. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
              Confidentialité
            </Link>
            <Link to="/terms" className="text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
              Conditions
            </Link>
            <Link to="/cookies" className="text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
